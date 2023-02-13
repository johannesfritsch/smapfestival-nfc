import { NFC } from "nfc-pcsc";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
} from "@apollo/client";
import fetch from "cross-fetch";
import {
  SubmitNfcPlacementMutation,
  SubmitNfcPlacementMutationVariables,
  SubmitNfcReaderKeepAliveMutation,
  SubmitNfcReaderKeepAliveMutationVariables,
} from "./generated/graphql";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.API_URL,
    fetch,
    headers: {
      authorization: `Bearer ${process.env.READER_TOKEN}`,
    },
  }),
});

setInterval(async () => {
  try {
    const res = await client.mutate<
      SubmitNfcReaderKeepAliveMutation,
      SubmitNfcReaderKeepAliveMutationVariables
    >({
      mutation: gql`
        mutation submitNfcReaderKeepAlive {
          submitNfcReaderKeepAlive {
            lastSeenAt
          }
        }
      `,
    });
    // console.log(
    //   "Sending keep alive signal with result",
    //   res.data?.submitNfcReaderKeepAlive.lastSeenAt
    // );
  } catch (error) {
    console.error(error);
  }
}, 1000);

const nfc = new NFC();

nfc.on("reader", async (reader: any) => {
  // enable when you want to auto-process ISO 14443-4 tags (standard=TAG_ISO_14443_4)
  // when an ISO 14443-4 is detected, SELECT FILE command with the AID is issued
  // the response is available as card.data in the card event
  // see examples/basic.js line 17 for more info
  // reader.aid = 'F222222222';

  reader.on("card", async (card: any) => {
    // card is object containing following data
    // [always] String type: TAG_ISO_14443_3 (standard nfc tags like MIFARE) or TAG_ISO_14443_4 (Android HCE and others)
    // [always] String standard: same as type
    // [only TAG_ISO_14443_3] String uid: tag uid
    // [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response

    console.log(`${reader.reader.name}  card detected`, card);
    try {
      await client.mutate<
        SubmitNfcPlacementMutation,
        SubmitNfcPlacementMutationVariables
      >({
        mutation: gql`
          mutation SubmitNfcPlacement($tagUid: ID!) {
            submitNfcPlacement(input: { tagUid: $tagUid }) {
              id
              name
            }
          }
        `,
        variables: { tagUid: card.uid },
      });
    } catch (error) {}
  });

  reader.on("card.off", (card: any) => {
    console.log(`${reader.reader.name}  card removed`, card);

    client
      .mutate({
        mutation: gql`
          mutation SubmitNfcRemoval($tagUid: ID!) {
            submitNfcRemoval(input: { tagUid: $tagUid }) {
              id
              name
            }
          }
        `,
        variables: { tagUid: card.uid },
      })
      .then((result) => console.log(result))
      .catch((error) => console.error(JSON.stringify(error, undefined, 2)));
  });

  reader.on("error", (err: any) => {
    console.log(`${reader.reader.name}  an error occurred`, err);
  });

  reader.on("end", () => {
    console.log(`${reader.reader.name}  device removed`);
  });
});

nfc.on("error", (err: any) => {
  console.log("an error occurred", err);
});
