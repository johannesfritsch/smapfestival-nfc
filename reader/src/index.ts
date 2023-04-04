import { Card, NFC, Reader } from "nfc-pcsc";
import { createReaderHandler } from "./handler";

const nfc = new NFC();

let readerIndex = 0;
nfc.on("reader", async (reader: Reader) => {
  console.log(`[global] ${reader.reader.name} device attached`);
  const readerToken = process.env[`READER_TOKEN${readerIndex++}`];

  if (readerToken) {
    console.log(`[global] ${reader.reader.name} has a token, connecting to API`);
    createReaderHandler(reader, {
      apiUrl: process.env.API_URL || "http://localhost:4000/graphql",
      readerToken,
    });
  }
});

nfc.on("error", (err: any) => {
  console.log("[global] an error occurred", err);
});
