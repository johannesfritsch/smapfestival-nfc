import { PubSub, withFilter } from "graphql-subscriptions";
import jwt from "jsonwebtoken";
import db from "./utils/db";
import { Context, Token } from ".";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import {
  Resolvers,
  NfcReaderState,
  SubscriptionEntryCreatedArgs,
  Subscription,
  SubscriptionNfcReaderUpdatedArgs,
} from "./generated/graphql";
import { DateTimeResolver } from "graphql-scalars";
import { Entry, Guest, Reader } from "@prisma/client";

const pubsub = new PubSub();

export default {
  DateTime: DateTimeResolver,
  EntryType: {
    guest: async (parent, {}, ctx) => {
      return await db.guest.findUnique({
        where: {
          id: parent.guestId || undefined,
        },
      });
    },
    reader: async (parent, {}, ctx) => {
      return await db.reader.findUnique({
        where: {
          id: parent.readerId || undefined,
        },
      });
    },
  },
  NfcReader: {
    currentTag: async (parent, {}, ctx) => {
      if (!parent.currentTagUid) return null;

      return {
        id: parent.currentTagUid,
        guest: await db.guest.findUnique({
          where: {
            tagUid: parent.currentTagUid || undefined,
          },
        }),
      };
    },
  },
  Query: {
    readers: async (_, {}, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      return await db.reader.findMany({ orderBy: { name: "asc" } });
    },
    guests: async (_, {}, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      return await db.guest.findMany({ orderBy: { name: "asc" } });
    },
    entries: async (_, { pagination }, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      console.log(pagination);

      return await db.entry.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        ...(pagination?.after
          ? { where: { createdAt: { lt: pagination.after } } }
          : {}),
      });
    },
  },
  Mutation: {
    login: async (_, { input: { email, password } }, {}) => {
      const user = await db.user.findUnique({
        where: {
          email,
        },
      });

      if (!user || !bcrypt.compareSync(password, user.passwordHash))
        throw new GraphQLError("Invalid password", {
          extensions: { code: "UNAUTHORIZED" },
        });

      return {
        token: jwt.sign(
          { role: "USER", userId: user.id } as Token,
          process.env.JWT_SECRET || "f03g03gj034mvflspfgj",
          { expiresIn: "10y" }
        ),
        user,
      };
    },
    createNfcReader: async (_, { input: { name, tracksEntries } }, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      const reader = await db.reader.create({
        data: {
          name,
          tracksEntries: tracksEntries || false,
        },
      });

      const token = jwt.sign(
        { role: "READER", readerId: reader.id } as Token,
        process.env.JWT_SECRET || "f03g03gj034mvflspfgj",
        { expiresIn: "10y" }
      );

      return {
        reader,
        token,
      };
    },
    updateNfcReader: async (_, { input: { id, name, tracksEntries } }, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      const updatedReader = await db.reader.update({
        where: {
          id,
        },
        data: {
          name,
          tracksEntries: tracksEntries || false,
        },
      });

      return updatedReader;
    },
    deleteNfcReader: async (_, { id }, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      try {
        await db.reader.delete({
          where: {
            id,
          },
        });
      } catch (error) {
        throw new GraphQLError("Reader not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      return true;
    },
    createGuest: async (_, { input: { name, tagUid } }, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      const guest = await db.guest.create({
        data: {
          name,
          tagUid,
        },
      });

      return guest;
    },
    updateGuest: async (_, { input: { id, name, tagUid } }, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      const updatedGuest = await db.guest.update({
        where: {
          id,
        },
        data: {
          name,
          tagUid,
        },
      });

      await pubsub.publish("GUEST_UPDATED", {
        guestUpdated: updatedGuest,
      });

      return updatedGuest;
    },
    deleteGuest: async (_, { id }, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      try {
        await db.guest.delete({
          where: {
            id,
          },
        });
      } catch (error) {
        throw new GraphQLError("Guest not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      return true;
    },
    submitNfcPlacement: async (_, { input: { tagUid } }, ctx) => {
      if (ctx.type !== "READER")
        throw new GraphQLError("You're not a reader", {
          extensions: { code: "UNAUTHORIZED" },
        });

      const updatedReader = await db.reader.update({
        where: {
          id: ctx.reader.id,
        },
        data: {
          currentTagUid: tagUid,
        },
      });

      if (updatedReader.tracksEntries) {
        const guest = await db.guest.findUniqueOrThrow({
          where: {
            tagUid,
          },
        });
        const entry = await db.entry.create({
          data: {
            guestId: guest.id,
            readerId: ctx.reader.id,
          },
        });
        await pubsub.publish("ENTRY_CREATED", {
          entryCreated: entry,
        });
      }

      await pubsub.publish("NFC_READER_UPDATED", {
        nfcReaderUpdated: updatedReader,
      });
      return updatedReader;
    },
    submitNfcRemoval: async (_, {}, ctx) => {
      if (ctx.type !== "READER")
        throw new GraphQLError("You're not a reader", {
          extensions: { code: "UNAUTHORIZED" },
        });

      const updatedReader = await db.reader.update({
        where: {
          id: ctx.reader.id,
        },
        data: {
          currentTagUid: null,
        },
      });

      await pubsub.publish("NFC_READER_UPDATED", {
        nfcReaderUpdated: updatedReader,
      });
      return updatedReader;
    },
    submitNfcReaderKeepAlive: async (_, {}, ctx) => {
      if (ctx.type !== "READER")
        throw new GraphQLError("You're not a reader", {
          extensions: { code: "UNAUTHORIZED" },
        });

      const updatedReader = await db.reader.update({
        where: {
          id: ctx.reader.id,
        },
        data: {
          lastSeenAt: new Date(),
        },
      });

      await pubsub.publish("NFC_READER_UPDATED", {
        nfcReaderUpdated: updatedReader,
      });
      return updatedReader;
    },
    createEntry: async (_, { input: { guestId, readerId } }, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      const entry = await db.entry.create({
        data: {
          guestId,
          readerId,
        },
      });

      await pubsub.publish("ENTRY_CREATED", {
        entryCreated: entry,
      });
      return entry;
    },
  },
  Subscription: {
    nfcReaderUpdated: {
      resolve: (payload: { nfcReaderUpdated: Reader }) =>
        payload.nfcReaderUpdated,
      subscribe: withFilter(
        (_, {}, ctx) => {
          if (ctx.type !== "USER")
            throw new GraphQLError("You're not a user", {
              extensions: { code: "UNAUTHORIZED" },
            });

          return pubsub.asyncIterator(["NFC_READER_UPDATED"]);
        },
        (
          payload: { nfcReaderUpdated: Reader },
          variables: SubscriptionNfcReaderUpdatedArgs
        ) => {
          if (
            variables.where?.readerIds &&
            !variables.where.readerIds.includes(payload.nfcReaderUpdated.id)
          ) {
            return false;
          }

          return true;
        }
      ) as any,
    },
    entryCreated: {
      resolve: (payload: { entryCreated: Entry }) => {
        return payload.entryCreated;
      },
      subscribe: withFilter(
        (_, {}, ctx) => {
          if (ctx.type !== "USER")
            throw new GraphQLError("You're not a user", {
              extensions: { code: "UNAUTHORIZED" },
            });

          return pubsub.asyncIterator(["ENTRY_CREATED"]);
        },
        (
          payload: { entryCreated: Entry },
          variables: SubscriptionEntryCreatedArgs
        ) => {
          return !(
            variables.where?.readerIds &&
            !variables.where.readerIds.includes(payload.entryCreated.readerId)
          );
        }
      ) as any,
    },
    guestUpdated: {
      resolve: (payload: { guestUpdated: Guest }) => {
        return payload.guestUpdated;
      },
      subscribe: (_, {}, ctx) => {
        if (ctx.type !== "USER")
          throw new GraphQLError("You're not a user", {
            extensions: { code: "UNAUTHORIZED" },
          });

        return pubsub.asyncIterator(["GUEST_UPDATED"]) as any;
      },
    },
  },
} as Resolvers<Context>;
