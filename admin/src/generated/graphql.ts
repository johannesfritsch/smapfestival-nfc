export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type CreateEntryInput = {
  guestId: Scalars['ID'];
  readerId: Scalars['ID'];
};

export type CreateGuestInput = {
  name: Scalars['String'];
  tagUid?: InputMaybe<Scalars['String']>;
};

export type CreateNfcReaderInput = {
  name: Scalars['String'];
  tracksEntries?: InputMaybe<Scalars['Boolean']>;
};

export type EntriesPaginationInput = {
  after?: InputMaybe<Scalars['DateTime']>;
};

export type EntryCreatedWhereInput = {
  readerIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type EntryType = {
  __typename?: 'EntryType';
  createdAt: Scalars['DateTime'];
  guest: GuestType;
  id: Scalars['ID'];
  reader: NfcReader;
};

export type GuestType = {
  __typename?: 'GuestType';
  id: Scalars['ID'];
  name: Scalars['String'];
  tagUid?: Maybe<Scalars['ID']>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createEntry: EntryType;
  createGuest: GuestType;
  createNfcReader: NfcReaderCreation;
  deleteEntry: Scalars['Boolean'];
  deleteGuest: Scalars['Boolean'];
  deleteNfcReader: Scalars['Boolean'];
  login: Session;
  submitNfcPlacement: NfcReader;
  submitNfcReaderKeepAlive: NfcReader;
  submitNfcRemoval: NfcReader;
  updateGuest: GuestType;
  updateNfcReader: NfcReader;
};


export type MutationCreateEntryArgs = {
  input: CreateEntryInput;
};


export type MutationCreateGuestArgs = {
  input: CreateGuestInput;
};


export type MutationCreateNfcReaderArgs = {
  input: CreateNfcReaderInput;
};


export type MutationDeleteEntryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteGuestArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteNfcReaderArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSubmitNfcPlacementArgs = {
  input: NfcPlacementInput;
};


export type MutationSubmitNfcRemovalArgs = {
  input: NfcRemovalInput;
};


export type MutationUpdateGuestArgs = {
  input: UpdateGuestInput;
};


export type MutationUpdateNfcReaderArgs = {
  input: UpdateNfcReaderInput;
};

export type NfcPlacementInput = {
  tagUid: Scalars['ID'];
};

export type NfcReader = {
  __typename?: 'NfcReader';
  currentTag?: Maybe<NfcTag>;
  id: Scalars['ID'];
  lastSeenAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  tracksEntries: Scalars['Boolean'];
};

export type NfcReaderCreation = {
  __typename?: 'NfcReaderCreation';
  reader: NfcReader;
  token: Scalars['String'];
};

export enum NfcReaderState {
  Offline = 'OFFLINE',
  Online = 'ONLINE'
}

export type NfcReaderUpdatedWhereInput = {
  readerIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type NfcRemovalInput = {
  tagUid: Scalars['ID'];
};

export type NfcTag = {
  __typename?: 'NfcTag';
  guest?: Maybe<GuestType>;
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  entries: Array<EntryType>;
  guests: Array<GuestType>;
  readers: Array<NfcReader>;
};


export type QueryEntriesArgs = {
  pagination?: InputMaybe<EntriesPaginationInput>;
};


export type QueryReadersArgs = {
  filter?: InputMaybe<ReadersFilterInput>;
};

export type ReadersFilterInput = {
  onlyEntry?: InputMaybe<Scalars['Boolean']>;
};

export type Session = {
  __typename?: 'Session';
  token: Scalars['String'];
  user: User;
};

export type Subscription = {
  __typename?: 'Subscription';
  entryCreated: EntryType;
  guestUpdated: GuestType;
  nfcReaderUpdated: NfcReader;
};


export type SubscriptionEntryCreatedArgs = {
  where?: InputMaybe<EntryCreatedWhereInput>;
};


export type SubscriptionNfcReaderUpdatedArgs = {
  where?: InputMaybe<NfcReaderUpdatedWhereInput>;
};

export type UpdateGuestInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  tagUid?: InputMaybe<Scalars['String']>;
};

export type UpdateNfcReaderInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  tracksEntries?: InputMaybe<Scalars['Boolean']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CreateGuestMutationVariables = Exact<{
  name: Scalars['String'];
  tagUid?: InputMaybe<Scalars['String']>;
}>;


export type CreateGuestMutation = { __typename?: 'Mutation', createGuest: { __typename?: 'GuestType', id: string, name: string, tagUid?: string | null } };

export type UpdateGuestMutationVariables = Exact<{
  id: Scalars['ID'];
  name: Scalars['String'];
  tagUid?: InputMaybe<Scalars['String']>;
}>;


export type UpdateGuestMutation = { __typename?: 'Mutation', updateGuest: { __typename?: 'GuestType', id: string, name: string, tagUid?: string | null } };

export type CreateNfcReaderMutationVariables = Exact<{
  name: Scalars['String'];
  tracksEntries: Scalars['Boolean'];
}>;


export type CreateNfcReaderMutation = { __typename?: 'Mutation', createNfcReader: { __typename?: 'NfcReaderCreation', token: string, reader: { __typename?: 'NfcReader', id: string, name: string, tracksEntries: boolean, lastSeenAt?: any | null, currentTag?: { __typename?: 'NfcTag', id: string, guest?: { __typename?: 'GuestType', id: string, name: string } | null } | null } } };

export type UpdateNfcReaderMutationVariables = Exact<{
  id: Scalars['ID'];
  name: Scalars['String'];
  tracksEntries: Scalars['Boolean'];
}>;


export type UpdateNfcReaderMutation = { __typename?: 'Mutation', updateNfcReader: { __typename?: 'NfcReader', id: string, name: string, tracksEntries: boolean, lastSeenAt?: any | null, currentTag?: { __typename?: 'NfcTag', id: string, guest?: { __typename?: 'GuestType', id: string, name: string } | null } | null } };

export type EntryFragmentFragment = { __typename?: 'EntryType', id: string, createdAt: any };

export type GetAllEntriesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['DateTime']>;
}>;


export type GetAllEntriesQuery = { __typename?: 'Query', entries: Array<{ __typename?: 'EntryType', id: string, createdAt: any, guest: { __typename?: 'GuestType', id: string, name: string, tagUid?: string | null }, reader: { __typename?: 'NfcReader', id: string, name: string, tracksEntries: boolean, lastSeenAt?: any | null, currentTag?: { __typename?: 'NfcTag', id: string, guest?: { __typename?: 'GuestType', id: string, name: string } | null } | null } }> };

export type DeleteEntryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteEntryMutation = { __typename?: 'Mutation', deleteEntry: boolean };

export type EntryCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type EntryCreatedSubscription = { __typename?: 'Subscription', entryCreated: { __typename?: 'EntryType', id: string, createdAt: any } };

export type GuestFragmentFragment = { __typename?: 'GuestType', id: string, name: string, tagUid?: string | null };

export type GetAllGuestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllGuestsQuery = { __typename?: 'Query', guests: Array<{ __typename?: 'GuestType', id: string, name: string, tagUid?: string | null }> };

export type GuestUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GuestUpdatedSubscription = { __typename?: 'Subscription', guestUpdated: { __typename?: 'GuestType', id: string, name: string, tagUid?: string | null } };

export type DeleteGuestMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteGuestMutation = { __typename?: 'Mutation', deleteGuest: boolean };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Session', token: string } };

export type NfcReaderFragmentFragment = { __typename?: 'NfcReader', id: string, name: string, tracksEntries: boolean, lastSeenAt?: any | null, currentTag?: { __typename?: 'NfcTag', id: string, guest?: { __typename?: 'GuestType', id: string, name: string } | null } | null };

export type GetAllReadersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllReadersQuery = { __typename?: 'Query', readers: Array<{ __typename?: 'NfcReader', id: string, name: string, tracksEntries: boolean, lastSeenAt?: any | null, currentTag?: { __typename?: 'NfcTag', id: string, guest?: { __typename?: 'GuestType', id: string, name: string } | null } | null }> };

export type NfcReaderUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NfcReaderUpdatedSubscription = { __typename?: 'Subscription', nfcReaderUpdated: { __typename?: 'NfcReader', id: string, name: string, tracksEntries: boolean, lastSeenAt?: any | null, currentTag?: { __typename?: 'NfcTag', id: string, guest?: { __typename?: 'GuestType', id: string, name: string } | null } | null } };

export type DeleteReaderMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteReaderMutation = { __typename?: 'Mutation', deleteNfcReader: boolean };

export type GuestEntryCreatedFragmentFragment = { __typename?: 'EntryType', id: string, createdAt: any, guest: { __typename?: 'GuestType', id: string, name: string, tagUid?: string | null } };

export type GuestEntryCreatedSubscriptionVariables = Exact<{
  readerIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type GuestEntryCreatedSubscription = { __typename?: 'Subscription', entryCreated: { __typename?: 'EntryType', id: string, createdAt: any, guest: { __typename?: 'GuestType', id: string, name: string, tagUid?: string | null } } };

export type GetEntryReadersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntryReadersQuery = { __typename?: 'Query', readers: Array<{ __typename?: 'NfcReader', id: string, name: string, tracksEntries: boolean, lastSeenAt?: any | null, currentTag?: { __typename?: 'NfcTag', id: string, guest?: { __typename?: 'GuestType', id: string, name: string } | null } | null }> };
