import Button from "@/components/Button";
import Form from "@/components/Form";
import { useRouter } from "next/router";
import { NFC_READER_FRAGMENT } from "../readers";
import { gql, useQuery } from "@apollo/client";
import {
  GetAllReadersQuery,
  GetAllReadersQueryVariables,
} from "@/generated/graphql";
import { useState } from "react";

export const GET_ENTRY_READERS = gql`
  ${NFC_READER_FRAGMENT}
  query GetEntryReaders {
    readers(filter: { onlyEntry: true }) {
      ...NfcReaderFragment
    }
  }
`;

export default function Example() {
  const router = useRouter();

  const { data } = useQuery<GetAllReadersQuery, GetAllReadersQueryVariables>(
    GET_ENTRY_READERS
  );

  const [selectedReaderIds, setSelectedReaderIds] = useState<string[]>([]);

  const handleChange = (readerId: string, state: boolean) => {
    if (state) {
      setSelectedReaderIds([...selectedReaderIds, readerId]);
    } else {
      setSelectedReaderIds(selectedReaderIds.filter((id) => id !== readerId));
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome Screen
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h1 className="text-xl mb-4">Select the readers to follow</h1>
            <p className="text-sm">
              The following list contains all the readers, which track entries.
              If you miss a reader, please double-check that the corresponding
              reader actually tracks entries.
            </p>
            <Form
              onCancel={() => router.push("/")}
              submitCaption="Start screen"
              onSubmit={() => { router.push('/screen/display?' + selectedReaderIds.map(id => `readerId=${id}`).join('&')) }}
              disabled={selectedReaderIds.length === 0}
            >
              <fieldset className="space-y-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"></div>
                </div>

                {data &&
                  data.readers.map((reader) => (
                    <div key={reader.id} className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          onChange={(e) => handleChange(e.target.value, e.target.checked)}
                          id={`reader-${reader.id}`}
                          aria-describedby={`reader-${reader.id}-description`}
                          name={`reader-${reader.id}`}
                          type="checkbox"
                          value={reader.id}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor={`reader-${reader.id}`}
                          className="font-medium text-gray-700 select-none"
                        >
                          {reader.name}
                        </label>
                      </div>
                    </div>
                  ))}
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
