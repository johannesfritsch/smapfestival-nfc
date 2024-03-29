import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import Table, { GuestTableRow } from "@/components/Table";
import { GUEST_FRAGMENT } from "@/fragments/guest";
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

  const handleAdd = async () => {
    setSelectedGuest(undefined);
    setEditModalOpen(true);
  }

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

      {data && data?.guests.length > 0 ? (
        <>
          <Section
            title="Guests"
            description="Here you can configure the connected guests."
            button={
              <Button
                caption="Create new guest"
                onClick={handleAdd}
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
        </>
      ) : (
        <EmptyState
          title="No guests"
          description="You have not created any guests yet."
          action={{ label: "Create new guest", onClick: handleAdd }}
        />
      )}
    </PageLayout>
  );
};

export default Index;
