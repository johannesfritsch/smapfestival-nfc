import { Card, NFC, Reader } from "nfc-pcsc";
import { createReaderHandler } from "./handler";

const nfc = new NFC();

let readerIndex = 0;
nfc.on("reader", async (reader: Reader) => {
  console.log(`[global] ${reader.reader.name} device attached`);
  createReaderHandler(reader, {
    apiUrl: process.env.API_URL || "http://localhost:4000/graphql",
    readerToken: process.env[`READER_TOKEN${readerIndex++}`] || '',
  });  
});

nfc.on("error", (err: any) => {
  console.log("[global] an error occurred", err);
});
