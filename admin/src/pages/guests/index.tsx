import Button from "@/components/Button";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Table, { GuestTableRow } from "@/components/Table";
import {
  GetAllGuestsQuery,
  GetAllGuestsQueryVariables,
  GuestType,
  GuestUpdatedSubscription,
  GuestUpdatedSubscriptionVariables,
} from "@/generated/graphql";
import EditGuestModal from "@/modals/EditGuestModal";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import React from "react";

export const GUEST_FRAGMENT = gql`
  fragment GuestFragment on GuestType {
    id
    name
    tagUid
  }
`;

const GET_ALL_GUESTS = gql`
  ${GUEST_FRAGMENT}
  query GetAllGuests {
    guests {
      ...GuestFragment
    }
  }
`;

const SUBSCRIBE_GUEST_UPDATE = gql`
  ${GUEST_FRAGMENT}
  subscription GuestUpdated {
    guestUpdated {
      ...GuestFragment
    }
  }
`;

const DELETE_GUEST = gql`
  mutation DeleteGuest($id: ID!) {
    deleteGuest(id: $id)
  }
`;

const Index = () => {
  const { data, refetch } = useQuery<
    GetAllGuestsQuery,
    GetAllGuestsQueryVariables
  >(GET_ALL_GUESTS);

  useSubscription<GuestUpdatedSubscription, GuestUpdatedSubscriptionVariables>(
    SUBSCRIBE_GUEST_UPDATE
  );

  const [deleteGuest] = useMutation(DELETE_GUEST);

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedGuest, setSelectedGuest] = React.useState<
    GuestType | undefined
  >(undefined);

  const handleDelete = async (guest: GuestType) => {
    if (confirm("Are you sure you want to delete this guest?")) {
      await deleteGuest({ variables: { id: guest.id } });
      await refetch();
    }
  };

  const handleEdit = async (guest: GuestType) => {
    setSelectedGuest(guest);
    setEditModalOpen(true);
  };

  return (
    <PageLayout>
      <EditGuestModal
        open={editModalOpen}
        guest={selectedGuest}
        onClose={async () => {
          await refetch();
          setEditModalOpen(false);
        }}
      />
      <Section
        title="Guests"
        description="Here you can configure the connected guests."
        button={
          <Button
            caption="Create new guest"
            onClick={() => {
              setSelectedGuest(undefined);
              setEditModalOpen(true);
            }}
          />
        }
      />
      <Table headings={["Name", "Tag", "Action"]}>
        {data?.guests.map((guest, index) => (
          <GuestTableRow
            key={guest.id}
            guest={guest}
            odd={index % 2 === 0}
            onDelete={() => handleDelete(guest)}
            onEdit={() => handleEdit(guest)}
          />
        ))}
      </Table>
    </PageLayout>
  );
};

export default Index;
