import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Table, { ReaderTableRow } from "@/components/Table";
import {
  GetAllReadersQuery,
  GetAllReadersQueryVariables,
  NfcReader,
  NfcReaderUpdatedSubscription,
  NfcReaderUpdatedSubscriptionVariables,
} from "@/generated/graphql";
import EditReaderModal from "@/modals/EditReaderModal";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import React from "react";

export const NFC_READER_FRAGMENT = gql`
  fragment NfcReaderFragment on NfcReader {
    id
    name
    tracksEntries
    lastSeenAt
    currentTag {
      id
      guest {
        id
        name
      }
    }
  }
`;

export const GET_ALL_READERS = gql`
  ${NFC_READER_FRAGMENT}
  query GetAllReaders {
    readers {
      ...NfcReaderFragment
    }
  }
`;

export const SUBSCRIBE_READER_UPDATE = gql`
  ${NFC_READER_FRAGMENT}
  subscription NfcReaderUpdated {
    nfcReaderUpdated {
      ...NfcReaderFragment
    }
  }
`;

export const DELETE_READER = gql`
  mutation DeleteReader($id: ID!) {
    deleteNfcReader(id: $id)
  }
`;

const ReadersPage = () => {
  const { data, refetch } = useQuery<
    GetAllReadersQuery,
    GetAllReadersQueryVariables
  >(GET_ALL_READERS);

  useSubscription<
    NfcReaderUpdatedSubscription,
    NfcReaderUpdatedSubscriptionVariables
  >(SUBSCRIBE_READER_UPDATE);

  const [deleteNfcReader] = useMutation(DELETE_READER);

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedReader, setSelectedReader] = React.useState<
    NfcReader | undefined
  >(undefined);

  const handleDelete = async (reader: NfcReader) => {
    if (confirm("Are you sure you want to delete this reader?")) {
      await deleteNfcReader({ variables: { id: reader.id } });
      await refetch();
    }
  };

  const handleAdd = async () => {
    setSelectedReader(undefined);
    setEditModalOpen(true);
  };

  const handleEdit = async (reader: NfcReader) => {
    setSelectedReader(reader);
    setEditModalOpen(true);
  };

  return (
    <PageLayout>
      <EditReaderModal
        open={editModalOpen}
        reader={selectedReader}
        onClose={async () => {
          await refetch();
          setEditModalOpen(false);
        }}
      />
      {data && data.readers.length > 0 ? (
        <>
          <Section
            title="Readers"
            description="Here you can configure the connected readers."
            button={<Button caption="Connect new reader" onClick={handleAdd} />}
          />
          <Table headings={["Name", "Entry reader", "Tag", "Action"]}>
            {data?.readers.map((reader, index) => (
              <ReaderTableRow
                key={reader.id}
                reader={reader}
                odd={index % 2 === 0}
                onDelete={() => handleDelete(reader)}
                onEdit={() => handleEdit(reader)}
              />
            ))}
          </Table>
        </>
      ) : (
        <EmptyState
          title="No readers connected"
          description="Create a first reader and configure the reader daemon with the token."
          action={{ label: "Connect first reader", onClick: handleAdd }}
        />
      )}
    </PageLayout>
  );
};

export default ReadersPage;
