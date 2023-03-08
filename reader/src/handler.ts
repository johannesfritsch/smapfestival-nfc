import { Card, Reader } from "nfc-pcsc";
import { ApolloClient, InMemoryCache, gql, HttpLink } from "@apollo/client";
import fetch from "cross-fetch";
import {
  SubmitNfcPlacementMutation,
  SubmitNfcPlacementMutationVariables,
  SubmitNfcReaderKeepAliveMutation,
  SubmitNfcReaderKeepAliveMutationVariables,
} from "./generated/graphql";

export const createReaderHandler = (reader: Reader, config: ReaderConfiguration) => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: config.apiUrl,
      fetch,
      headers: {
        authorization: `Bearer ${config.readerToken}`,
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

  reader.on("card", async (card: Card) => {
    console.log("card", card);

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

  reader.on("card.off", (card: Card) => {
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
};
