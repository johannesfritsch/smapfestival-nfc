import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { json } from "body-parser";
import express from "express";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import fs from "fs";
import path from "path";
import resolvers from "./resolvers";
import { Reader } from "@prisma/client";
import jwt from "jsonwebtoken";
import db from "./utils/db";

export type Token =
  | {
      role: "READER";
      readerId: string;
    }
  | {
      role: "USER";
      userId: string;
    };

export type UnauthorizedContext = {
  type: "UNAUTHORIZED";
};

export type ReaderContext = {
  type: "READER";
  reader: Reader;
};

export type UserContext = {
  type: "USER";
  user: any;
};

export type Context = UnauthorizedContext | ReaderContext | UserContext;

const schema = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, "../schema.graphql"), "utf8"),
  resolvers,
});

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: "/graphql",
});

const createContext = async (token?: string): Promise<Context> => {
  if (!token)
    return {
      type: "UNAUTHORIZED",
    };

  try {
    const decodedToken = (await jwt.verify(
      token,
      process.env.JWT_SECRET || "f03g03gj034mvflspfgj"
    )) as Token;

    if (decodedToken.role === "READER") {
      const reader = await db.reader.findUniqueOrThrow({
        where: {
          id: decodedToken.readerId,
        },
      });
      return {
        type: "READER",
        reader,
      };
    }

    if (decodedToken.role === "USER") {
      const user = await db.user.findUniqueOrThrow({
        where: {
          id: decodedToken.userId,
        },
      });
      return {
        type: "USER",
        user,
      };
    }
  } catch (error) {}
  return {
    type: "UNAUTHORIZED",
  };
};

const serverCleanup = useServer(
  {
    schema,
    context: async (ctx, msg, args) => {
      const tokenString = ctx.connectionParams
        ? ctx.connectionParams["Authorization"]
          ? (ctx.connectionParams["Authorization"] as string).split(" ")[1]
          : undefined
        : undefined;

      return await createContext(tokenString);
    },
  },
  wsServer
);

const server = new ApolloServer<Context>({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});
// Note you must call `server.start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`

const main = async () => {
  await server.start();

  // Specify the path where we'd like to mount our server
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware<Context>(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(" ")[1];
        return await createContext(token);
      },
    })
  );

  httpServer.listen(4000, () => {
    console.log("🚀 Server ready at http://localhost:4000/graphql");
  });
};

main();
