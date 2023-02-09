import { PubSub } from "graphql-subscriptions";
import jwt from "jsonwebtoken";
import db from "./utils/db";
import { Context, Token } from ".";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import { Resolvers } from "./generated/graphql";

const pubsub = new PubSub();

export default {
  Query: {
    readers: async (_, {}, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      return await db.reader.findMany();
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
    createNfcReader: async (_, { input: { name } }, ctx) => {
      if (ctx.type !== "USER")
        throw new GraphQLError("You're not a user", {
          extensions: { code: "UNAUTHORIZED" },
        });

      const reader = await db.reader.create({
        data: {
          name,
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
    }
  },
  Subscription: {
    nfcReaderUpdated: {
      resolve: (payload: any) => payload.nfcReaderUpdated,
      subscribe: (_, {}, ctx) => {
        if (ctx.type !== "USER")
          throw new GraphQLError("You're not a user", {
            extensions: { code: "UNAUTHORIZED" },
          });

        return pubsub.asyncIterator(["NFC_READER_UPDATED"]) as any;
      },
    },
  },
} as Resolvers<Context>;
