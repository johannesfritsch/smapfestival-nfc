import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "api/schema.graphql",
  generates: {
    "api/src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        mappers: {
          NfcReader: "@prisma/client#Reader",
          EntryType: "@prisma/client#Entry",
          GuestType: "@prisma/client#Guets",
        },
      },
    },
    "admin/src/generated/graphql.ts": {
      documents: "admin/src/**/*.{ts,tsx}",
      plugins: ["typescript", "typescript-operations"],
    },
    "reader/src/generated/graphql.ts": {
      documents: "reader/src/**/*.{ts,tsx}",
      plugins: ["typescript", "typescript-operations"],
    },
  },
};

export default config;
