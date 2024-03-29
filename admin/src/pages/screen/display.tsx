import {
  GuestEntryCreatedSubscription,
  GuestEntryCreatedSubscriptionVariables,
} from "@/generated/graphql";
import { gql, useApolloClient } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { ENTRY_FRAGMENT } from "../entries";

import { XCircleIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Link from "next/link";
import { GUEST_FRAGMENT } from "@/fragments/guest";
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
  const loopVideo = useRef<HTMLVideoElement>(null);
  const scanVideo = useRef<HTMLVideoElement>(null);

  const router = useRouter();

  const client = useApolloClient();
  useEffect(() => {
    if (loopVideo.current) {
      console.log("Starting loop video");
      loopVideo.current.currentTime = 0;
      loopVideo.current.play();
    }
  }, [loopVideo]);

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
      if (sub.data) {
        if (scanVideo.current) {
          scanVideo.current.currentTime = 0;
          scanVideo.current.play();
        }

        setTimeout(() => {
          if (sub.data) {
            setGreetingName(sub.data.entryCreated.guest.name);
          }
        }, 1300);

        setTimeout(() => {
          setGreetingName(undefined);
        }, 5000);

        setTimeout(() => {
          if (scanVideo.current) {
            scanVideo.current.pause();
            scanVideo.current.currentTime = 0;
          }
        }, 4000);
      }
    });
    return () => {
      subscr.unsubscribe();
    };
  });

  return (
    <>
      <div className="relative h-screen">
        <video
          ref={scanVideo}
          className="absolute top-0 left-0 w-full h-full object-cover z-30"
        >
          <source src="/videos/scan.webm" type="video/webm" />
        </video>
        <video
          ref={loopVideo}
          className="absolute top-0 left-0 w-full h-full object-cover z-10"
          loop={true}
        >
          <source src="/videos/loop.webm" type="video/webm" />
        </video>

        {greetingName && (
          <div
            style={{ fontFamily: "'Jost-Black', sans-serif" }}
            className="text-white animate-text duration-[3700ms] leading-none uppercase text-[7vw] px-[1vw] absolute inset-0 flex items-center justify-center text-center z-20"
          >
            <span className="">{greetingName}</span>
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 m-3 z-30">
        <Link href="/">
          <XCircleIcon className="w-10 h-10 text-gray-300 cursor-pointer opacity-10 hover:opacity-100" />
        </Link>
        <a
          onClick={() => {
            if (scanVideo.current) {
              scanVideo.current.muted = false;
            }
          }}
        >
          <SpeakerWaveIcon className="w-10 h-10 text-gray-300 cursor-pointer opacity-10 hover:opacity-100" />
        </a>
      </div>
    </>
  );
};

export default Display;
