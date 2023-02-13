/* eslint-disable react/no-unescaped-entities */

import {
  GetAllReadersQuery,
  GetAllReadersQueryVariables,
  NfcReaderUpdatedSubscription,
  NfcReaderUpdatedSubscriptionVariables,
} from "@/generated/graphql";
import { GET_ALL_READERS, SUBSCRIBE_READER_UPDATE } from "@/pages/readers";
import { classNames } from "@/utils/css";
import { useQuery, useSubscription } from "@apollo/client";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { PropsWithChildren, useState } from "react";

export type FormProps = PropsWithChildren<{
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  submitCaption?: string;
  cancelCaption?: string;
}>;

export default function Form({
  onCancel,
  onSubmit,
  children,
  cancelCaption,
  submitCaption,
}: FormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmit(data);
  };

  return (
    <form
      className="space-y-8 divide-y divide-gray-200"
      onSubmit={handleSubmit}
    >
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="py-6">
          <div className=" grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {children}
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3 pt-4">
        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
        >
          {submitCaption || "Submit"}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
          onClick={onCancel}
        >
          {cancelCaption || "Cancel"}
        </button>
      </div>
    </form>
  );
}

export type TextFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  onChange: (value: string) => void;
  value: string;
};

export const TextField = ({
  name,
  label,
  placeholder,
  value,
  onChange,
}: TextFieldProps) => {
  return (
    <div className="sm:col-span-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name={name}
          id={name}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export type BooleanFieldProps = {
  name: string;
  label: string;
  onChange: (val: boolean) => void;
  value: boolean;
};

export const BooleanField = ({
  name,
  label,
  value,
  onChange,
}: BooleanFieldProps) => {
  return (
    <div className="sm:col-span-6 text-sm">
      <div className="mt-1">
        <input
          type="checkbox"
          name={name}
          id={name}
          value="true"
          className="inline-block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          checked={value}
          onChange={(e) => {
            e.target.checked ? onChange(true) : onChange(false);
          }}
        />{" "}
        <label htmlFor={name} className="ml-2">
          {label}
        </label>
      </div>
    </div>
  );
};

export type TagUidFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  onChange: (value: string) => void;
  value: string;
};

export const TagUidField = ({
  name,
  label,
  placeholder,
  value,
  onChange,
}: TagUidFieldProps) => {
  const [open, setOpen] = useState(false);

  const { data, loading, error } = useQuery<
    GetAllReadersQuery,
    GetAllReadersQueryVariables
  >(GET_ALL_READERS);

  useSubscription<
    NfcReaderUpdatedSubscription,
    NfcReaderUpdatedSubscriptionVariables
  >(SUBSCRIBE_READER_UPDATE);

  return (
    <div className="sm:col-span-6 pb-24">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type="text"
          name={name}
          id={name}
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setOpen(() => !open);
          }}
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
        >
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
        {open && (
          <div className="absolute z-10 mt-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {data?.readers
              .filter((reader) => reader.currentTag && !reader.currentTag.guest)
              .map((reader) => (
                <div
                  key={reader.id}
                  className={classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    false ? "bg-indigo-600 text-white" : "text-gray-900"
                  )}
                >
                  <div className="flex items-center cursor-pointer" onClick={() => {onChange(reader.currentTag?.id || ''); setOpen(false); }}>
                    <span
                      className={classNames(
                        "inline-block h-2 w-2 flex-shrink-0 rounded-full",
                        false ? "bg-green-400" : "bg-gray-200"
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={classNames(
                        "ml-3 truncate",
                        true && "font-semibold"
                      )}
                    >
                      Ungenutztes Tag in {reader.name}: ({reader.currentTag?.id})
                      <span className="sr-only">
                        {" "}
                        is {false ? "online" : "offline"}
                      </span>
                    </span>
                  </div>

                  {false && (
                    <span
                      className={classNames(
                        "absolute inset-y-0 right-0 flex items-center pr-4",
                        false ? "text-white" : "text-indigo-600"
                      )}
                    >
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

// import { useState } from 'react'
// import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
// import { Combobox } from '@headlessui/react'

// const people = [
//   { id: 1, name: 'Leslie Alexander', online: true },
//   // More users...
// ]

// function Example() {
//   const [query, setQuery] = useState('')
//   const [selectedPerson, setSelectedPerson] = useState(null)

//   const filteredPeople =
//     query === ''
//       ? people
//       : people.filter((person) => {
//           return person.name.toLowerCase().includes(query.toLowerCase())
//         })

//   return (
//     <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
//       <Combobox.Label className="block text-sm font-medium text-gray-700">Assigned to</Combobox.Label>
//       <div className="relative mt-1">
//         <Combobox.Input
//           className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
//           onChange={(event) => setQuery(event.target.value)}
//           displayValue={(person) => person?.name}
//         />
//         <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
//           <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
//         </Combobox.Button>

//         {filteredPeople.length > 0 && (
//           <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//             {filteredPeople.map((person) => (
//               <Combobox.Option
//                 key={person.id}
//                 value={person}
//                 className={({ active }) =>
//                   classNames(
//                     'relative cursor-default select-none py-2 pl-3 pr-9',
//                     active ? 'bg-indigo-600 text-white' : 'text-gray-900'
//                   )
//                 }
//               >
//                 {({ active, selected }) => (
//                   <>
//                     <div className="flex items-center">
//                       <span
//                         className={classNames(
//                           'inline-block h-2 w-2 flex-shrink-0 rounded-full',
//                           person.online ? 'bg-green-400' : 'bg-gray-200'
//                         )}
//                         aria-hidden="true"
//                       />
//                       <span className={classNames('ml-3 truncate', selected && 'font-semibold')}>
//                         {person.name}
//                         <span className="sr-only"> is {person.online ? 'online' : 'offline'}</span>
//                       </span>
//                     </div>

//                     {selected && (
//                       <span
//                         className={classNames(
//                           'absolute inset-y-0 right-0 flex items-center pr-4',
//                           active ? 'text-white' : 'text-indigo-600'
//                         )}
//                       >
//                         <CheckIcon className="h-5 w-5" aria-hidden="true" />
//                       </span>
//                     )}
//                   </>
//                 )}
//               </Combobox.Option>
//             ))}
//           </Combobox.Options>
//         )}
//       </div>
//     </Combobox>
//   )
// }
