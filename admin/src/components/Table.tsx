import { EntryType, GuestType, NfcReader } from "@/generated/graphql";
import {
  BoltIcon,
  BoltSlashIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/solid";
import {
  CreditCardIcon,
  ArchiveBoxXMarkIcon,
  UserIcon,
  CheckCircleIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export type TableProps = {
  headings: string[];
  children: React.ReactNode;
};

export default function Table({ headings, children }: TableProps) {
  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {headings.map((heading, index) =>
                    index === 0 ? (
                      <th
                        key={heading}
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        {heading}
                      </th>
                    ) : index + 2 <= headings.length ? (
                      <th
                        key={heading}
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {heading}
                      </th>
                    ) : (
                      <th
                        key={heading}
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6 font-semibold text-sm text-right"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white">{children}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export type TableRowProps = {
  odd: boolean;
  children: React.ReactNode;
};

export const TableRow = ({ odd, children }: TableRowProps) => {
  return <tr className={odd ? undefined : "bg-gray-50"}>{children}</tr>;
};

export type TableColProps = {
  type: "first" | "middle" | "last";
  children: React.ReactNode;
};

export const TableCol = ({ type, children }: TableColProps) => {
  return (
    <td
      className={
        type === "first"
          ? "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
          : type === "middle"
          ? "whitespace-nowrap py-4 pl-3 pr-3 text-sm font-medium text-gray-900"
          : "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
      }
    >
      {children}
    </td>
  );
};

export type GuestTableRowProps = {
  guest: GuestType;
  odd: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export const GuestTableRow = ({
  guest,
  odd,
  onDelete,
  onEdit,
}: GuestTableRowProps) => {
  return (
    <TableRow odd={odd}>
      <TableCol type="first">{guest.name}</TableCol>
      <TableCol type="middle">{guest.tagUid}</TableCol>
      <TableCol type="last">
        <button
          onClick={() => onEdit(guest.id)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(guest.id)}
          className="text-indigo-600 hover:text-indigo-900 ml-2"
        >
          Delete
        </button>
      </TableCol>
    </TableRow>
  );
};

export type ReaderTableRowProps = {
  reader: NfcReader;
  odd: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export const ReaderTableRow = ({
  reader,
  odd,
  onDelete,
  onEdit,
}: ReaderTableRowProps) => {
  const [now, setNow] = useState<Date>(new Date());
  const online = new Date(reader.lastSeenAt) > new Date(now.getTime() - 2_000);
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 500);
    return () => clearInterval(interval);
  });

  const StateIcon = online ? BoltIcon : BoltSlashIcon;
  return (
    <TableRow odd={odd}>
      <TableCol type="first">
        <StateIcon
          className={`w-4 h-4 inline mr-2 ${
            online ? "text-green-500" : "text-red-500"
          }`}
        />{" "}
        {reader.name}
        <br />
        <span className="italic text-gray-400 text-sm">{reader.id}</span>{" "}
        <ClipboardIcon
          className="inline-block w-4 h-4 text-gray-400 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(reader.id);
          }}
        />
      </TableCol>
      <TableCol type="first">
        {reader.tracksEntries ? (
          <CheckCircleIcon className="w-4 h-4 inline mr-2 text-green-500" />
        ) : (
          <NoSymbolIcon className="w-4 h-4 inline mr-2 text-red-500" />
        )}
      </TableCol>
      <TableCol type="middle">
        <div className=" border-stone-200 rounded-full p-2 pl-4 w-48 text-sm text-stone-400">
          {!reader.currentTag ? (
            <>
              <ArchiveBoxXMarkIcon className="h-5 w-5 text-gray-200 inline mr-2 text-ellipsis" />{" "}
              No tag present
            </>
          ) : !reader.currentTag.guest ? (
            <>
              <CreditCardIcon
                title={reader.currentTag.id}
                className="h-5 w-5 text-gray-500 inline mr-2 text-ellipsis"
              />{" "}
              {reader.currentTag.id}{" "}
              <ClipboardIcon
                className="inline-block w-4 h-4 text-gray-400 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(reader.currentTag?.id || "");
                }}
              />
            </>
          ) : (
            <>
              <UserIcon
                title={reader.currentTag.guest.name}
                className="h-5 w-5 text-green-500 inline mr-2 text-ellipsis"
              />{" "}
              {reader.currentTag.guest.name}
            </>
          )}
        </div>
      </TableCol>
      <TableCol type="last">
        <button
          onClick={() => onEdit(reader.id)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(reader.id)}
          className="text-indigo-600 hover:text-indigo-900 ml-2"
        >
          Delete
        </button>
      </TableCol>
    </TableRow>
  );
};

export type EntryTableRowProps = {
  entry: EntryType;
  odd: boolean;
  onDelete: (id: string) => void;
};

export const EntryTableRow = ({ entry, odd, onDelete }: EntryTableRowProps) => {
  return (
    <TableRow odd={odd}>
      <TableCol type="first">
        {new Date(entry.createdAt).toLocaleString()}
      </TableCol>
      <TableCol type="middle">{entry.guest.name}</TableCol>
      <TableCol type="middle">{entry.reader.name}</TableCol>
      <TableCol type="last">
        <button
          onClick={() => onDelete(entry.id)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Delete
        </button>
      </TableCol>
    </TableRow>
  );
};
