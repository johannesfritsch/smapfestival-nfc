import Form, { TagUidField, TextField } from "@/components/Form";
import Modal from "@/components/Modal";
import {
  CreateGuestMutation,
  CreateGuestMutationVariables,
  GuestType,
} from "@/generated/graphql";
import { GUEST_FRAGMENT } from "@/pages/guests";
import { gql, useMutation } from "@apollo/client";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { mergeDeepLeft } from "ramda";

export type EditGuestModalProps = {
  guest: GuestType | undefined;
  open: boolean;
  onClose: () => void;
};

const EditGuestModal = ({ guest, open, onClose }: EditGuestModalProps) => {
  const [workingCopy, setWorkingCopy] = useState<Partial<GuestType>>({
    name: "",
  });

  useEffect(() => {
    if (guest) setWorkingCopy(mergeDeepLeft({}, guest));
  }, [guest]);

  const [createGuest] = useMutation<
    CreateGuestMutation,
    CreateGuestMutationVariables
  >(gql`
    ${GUEST_FRAGMENT}
    mutation CreateGuest($name: String!, $email: String!, $tagUid: String) {
      createGuest(input: { name: $name, email: $email, tagUid: $tagUid }) {
        ...GuestFragment
      }
    }
  `);

  const [updateGuest] = useMutation(gql`
    ${GUEST_FRAGMENT}
    mutation UpdateGuest($id: ID!, $name: String!, $email: String!, $tagUid: String) {
      updateGuest(input: { id: $id, name: $name, email: $email, tagUid: $tagUid }) {
        ...GuestFragment
      }
    }
  `);

  const handleFormSubmit = async () => {
    if (!workingCopy?.id) {
      await createGuest({
        variables: {
          name: workingCopy?.name || "",
          email: workingCopy?.email || "",
          ...((workingCopy.tagUid || "").trim().length > 0 ? {tagUid: workingCopy?.tagUid || ""} : { tagUid: null }),
        },
      });
    } else {
      await updateGuest({
        variables: {
          id: workingCopy?.id,
          name: workingCopy?.name || "",
          email: workingCopy?.email || "",
          ...((workingCopy.tagUid || "").trim().length > 0 ? {tagUid: workingCopy?.tagUid || ""} : { tagUid: null }),
        },
      });
    }
    onClose();
  };

  const handleClose = async () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={
        <ArchiveBoxArrowDownIcon
          className="h-6 w-6 text-green-600"
          aria-hidden="true"
        />
      }
      title="Connect new guest"
      description="Fill in this form to connect a new guest. After you give it a name, you receive a token to configure the guest daemon."
      button="Proceed to connect guest"
    >
      <Form onCancel={() => handleClose()} onSubmit={handleFormSubmit}>
        <TextField
          name="name"
          label="Name your guest"
          placeholder="Guest name"
          value={workingCopy?.name || ""}
          onChange={(val) => {
            if (workingCopy)
              setWorkingCopy(mergeDeepLeft({ name: val }, workingCopy));
          }}
        />
        <TextField
          name="email"
          label="Guest Email"
          placeholder="Guest Email"
          value={workingCopy?.email || ""}
          onChange={(val) => {
            if (workingCopy)
              setWorkingCopy(mergeDeepLeft({ email: val }, workingCopy));
          }}
        />
        <TagUidField
          name="tagUid"
          label="Tag UID"
          placeholder="Enter the UID of the tag"
          value={workingCopy?.tagUid || ""}
          onChange={(val) => {
            if (workingCopy)
              setWorkingCopy(mergeDeepLeft({ tagUid: val }, workingCopy));
          }}
        />
      </Form>
    </Modal>
  );
};

export default EditGuestModal;
