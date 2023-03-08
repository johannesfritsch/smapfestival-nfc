import Button from "@/components/Button";
import Form, { BooleanField, TextField } from "@/components/Form";
import Modal from "@/components/Modal";
import {
  CreateNfcReaderMutation,
  CreateNfcReaderMutationVariables,
  NfcReader,
  NfcReaderFragmentFragment,
} from "@/generated/graphql";
import { NFC_READER_FRAGMENT } from "@/pages/readers";
import { gql, useMutation } from "@apollo/client";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useReducer, useState } from "react";
import { mergeDeepLeft } from "ramda";

export type EditReaderModalProps = {
  reader: NfcReader | undefined;
  open: boolean;
  onClose: () => void;
};

const EditReaderModal = ({ reader, open, onClose }: EditReaderModalProps) => {
  const [workingCopy, setWorkingCopy] = useState<Partial<NfcReader>>({ name: "", tracksEntries: false });

  useEffect(() => {
    if (reader) setWorkingCopy(mergeDeepLeft({}, reader));
  }, [reader]);

  const [createNfcReader] = useMutation<
    CreateNfcReaderMutation,
    CreateNfcReaderMutationVariables
  >(gql`
    ${NFC_READER_FRAGMENT}
    mutation CreateNfcReader($name: String!, $tracksEntries: Boolean!) {
      createNfcReader(input: { name: $name, tracksEntries: $tracksEntries }) {
        token
        reader {
          ...NfcReaderFragment
        }
      }
    }
  `);

  const [updateNfcReader] = useMutation(gql`
    ${NFC_READER_FRAGMENT}
    mutation UpdateNfcReader(
      $id: ID!
      $name: String!
      $tracksEntries: Boolean!
    ) {
      updateNfcReader(
        input: { id: $id, name: $name, tracksEntries: $tracksEntries }
      ) {
        ...NfcReaderFragment
      }
    }
  `);

  const [token, setToken] = React.useState<string | undefined>(undefined);

  const handleFormSubmit = async () => {
    if (!workingCopy?.id) {
      const result = await createNfcReader({
        variables: {
          name: workingCopy?.name || "",
          tracksEntries: workingCopy?.tracksEntries || false,
        },
      });
      setToken(result.data?.createNfcReader.token);
    } else {
      await updateNfcReader({
        variables: {
          id: workingCopy?.id,
          name: workingCopy?.name || "",
          tracksEntries: workingCopy?.tracksEntries || false,
        },
      });
      onClose();
    }
  };

  const handleClose = async () => {
    setToken(undefined);
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
      title="Connect new reader"
      description="Fill in this form to connect a new reader. After you give it a name, you receive a token to configure the reader daemon."
      button="Proceed to connect reader"
    >
      {!token && (
        <Form onCancel={() => handleClose()} onSubmit={handleFormSubmit}>
          <TextField
            name="name"
            label="Name your reader"
            placeholder="Reader name"
            value={workingCopy?.name || ""}
            onChange={(val) => {
              if (workingCopy)
                setWorkingCopy(mergeDeepLeft({ name: val }, workingCopy));
            }}
          />
          <BooleanField
            name="tracksEntries"
            label="Tracks entries"
            value={workingCopy?.tracksEntries || false}
            onChange={(val) => {
              if (workingCopy)
                setWorkingCopy(
                  mergeDeepLeft({ tracksEntries: val }, workingCopy)
                );
            }}
          />
        </Form>
      )}
      {token && (
        <div className="flex flex-col items-center">
          <div>
            <textarea value={token} />
            <Button caption="Close" onClick={handleClose} />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EditReaderModal;
