import Button from "@/components/Button";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Table, { EntryTableRow } from "@/components/Table";
import {
  EntryCreatedSubscription,
  EntryCreatedSubscriptionVariables,
  GetAllEntriesQuery,
  GetAllEntriesQueryVariables,
} from "@/generated/graphql";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { NFC_READER_FRAGMENT } from "../readers";
import { GUEST_FRAGMENT } from "../guests";

export const ENTRY_FRAGMENT = gql`
  fragment EntryFragment on EntryType {
    id
    createdAt
  }
`;

const GET_ALL_ENTRIES = gql`
  ${ENTRY_FRAGMENT}
  ${GUEST_FRAGMENT}
  ${NFC_READER_FRAGMENT}
  query GetAllEntries($after: DateTime) {
    entries(pagination: { after: $after }) {
      ...EntryFragment
      guest {
        ...GuestFragment
      }
      reader {
        ...NfcReaderFragment
      }
    }
  }
`;

const DELETE_ENTRY = gql`
  mutation DeleteEntry($id: ID!) {
    deleteEntry(id: $id)
  }
`;

const SUBSCRIBE_ENTRY_CREATED = gql`
  ${ENTRY_FRAGMENT}
  subscription EntryCreated {
    entryCreated {
      ...EntryFragment
    }
  }
`;

let now = new Date();

const Index = () => {
  const { data, refetch, fetchMore } = useQuery<
    GetAllEntriesQuery,
    GetAllEntriesQueryVariables
  >(GET_ALL_ENTRIES, {
    variables: {
      after: now,
    },
  });

  const client = useApolloClient();
  const sub = client.subscribe<
    EntryCreatedSubscription,
    EntryCreatedSubscriptionVariables
  >({
    query: SUBSCRIBE_ENTRY_CREATED,
  });

  sub.subscribe((sub) => {
    sub.data && refetch({ after: new Date() });
  });

  useEffect(() => {
    now = new Date();
    refetch({
      after: now,
    });
  }, []);

  const [deleteEntry] = useMutation(DELETE_ENTRY);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      await deleteEntry({ variables: { id } });
      await refetch();
    }
  };

  return (
    <PageLayout>
      <Section
        title="Entries"
        description="Here you can configure the connected entries."
      />
      <Table headings={["Entered", "Guest", "Reader", "Actions"]}>
        {data?.entries.map((entry, index) => (
          <EntryTableRow
            key={entry.id}
            entry={entry}
            odd={index % 2 === 0}
            onDelete={handleDelete}
          />
        ))}
      </Table>
      <Button
        caption="Fetch more"
        className="mt-4 mb-10"
        onClick={() =>
          fetchMore({
            variables: {
              after: data?.entries[data?.entries.length - 1].createdAt,
            },
          })
        }
      />
    </PageLayout>
  );
};

export default Index;
