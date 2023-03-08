import {
  EntryCreatedSubscription,
  EntryCreatedSubscriptionVariables,
  GuestEntryCreatedSubscription,
  GuestEntryCreatedSubscriptionVariables,
} from "@/generated/graphql";
import { gql, useApolloClient } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { ENTRY_FRAGMENT, SUBSCRIBE_ENTRY_CREATED } from "../entries";
import { GUEST_FRAGMENT } from "../guests";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
const GUEST_ENTRY_CREATED_FRAGMENT = gql`
  ${ENTRY_FRAGMENT}
  ${GUEST_FRAGMENT}
  fragment GuestEntryCreatedFragment on EntryType {
    ...EntryFragment
    guest {
      ...GuestFragment
    }
  }
`;

const SUBSCRIBE_GUEST_ENTRY_CREATED = gql`
  ${GUEST_ENTRY_CREATED_FRAGMENT}
  subscription GuestEntryCreated($readerIds: [ID!]!) {
    entryCreated(where: { readerIds: $readerIds }) {
      ...GuestEntryCreatedFragment
    }
  }
`;

const Display = () => {
  const [greetingName, setGreetingName] = useState<string | undefined>();

  const router = useRouter();

  const client = useApolloClient();
  useEffect(() => {
    const sub = client.subscribe<
      GuestEntryCreatedSubscription,
      GuestEntryCreatedSubscriptionVariables
    >({
      query: SUBSCRIBE_GUEST_ENTRY_CREATED,
      variables: {
        readerIds: router.query.readerId as string[],
      },
    });
    const subscr = sub.subscribe((sub) => {
      console.log(sub);
      if (sub.data) {
        setGreetingName(sub.data.entryCreated.guest.name);
        setTimeout(() => {
          setGreetingName(undefined);
        }, 3000);
      }
    });
    return () => {
      subscr.unsubscribe();
    };
  });

  return (
    <>
      <div className="absolute top-0 right-0 m-3">
        <a href="/">
          <XCircleIcon className="w-10 h-10 text-gray-300 cursor-pointer" />
        </a>
      </div>
      {greetingName && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl text-center">
          Hello world, {greetingName}!
        </div>
      )}
    </>
  );
};

export default Display;
