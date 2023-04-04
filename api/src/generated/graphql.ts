import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Reader, Entry, Guets } from '@prisma/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  email: Scalars['String'];
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
  email: Scalars['String'];
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
  email: Scalars['String'];
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateEntryInput: CreateEntryInput;
  CreateGuestInput: CreateGuestInput;
  CreateNfcReaderInput: CreateNfcReaderInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  EntriesPaginationInput: EntriesPaginationInput;
  EntryCreatedWhereInput: EntryCreatedWhereInput;
  EntryType: ResolverTypeWrapper<Entry>;
  GuestType: ResolverTypeWrapper<Guets>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  NfcPlacementInput: NfcPlacementInput;
  NfcReader: ResolverTypeWrapper<Reader>;
  NfcReaderCreation: ResolverTypeWrapper<Omit<NfcReaderCreation, 'reader'> & { reader: ResolversTypes['NfcReader'] }>;
  NfcReaderState: NfcReaderState;
  NfcReaderUpdatedWhereInput: NfcReaderUpdatedWhereInput;
  NfcRemovalInput: NfcRemovalInput;
  NfcTag: ResolverTypeWrapper<Omit<NfcTag, 'guest'> & { guest?: Maybe<ResolversTypes['GuestType']> }>;
  Query: ResolverTypeWrapper<{}>;
  ReadersFilterInput: ReadersFilterInput;
  Session: ResolverTypeWrapper<Session>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  UpdateGuestInput: UpdateGuestInput;
  UpdateNfcReaderInput: UpdateNfcReaderInput;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateEntryInput: CreateEntryInput;
  CreateGuestInput: CreateGuestInput;
  CreateNfcReaderInput: CreateNfcReaderInput;
  DateTime: Scalars['DateTime'];
  EntriesPaginationInput: EntriesPaginationInput;
  EntryCreatedWhereInput: EntryCreatedWhereInput;
  EntryType: Entry;
  GuestType: Guets;
  ID: Scalars['ID'];
  LoginInput: LoginInput;
  Mutation: {};
  NfcPlacementInput: NfcPlacementInput;
  NfcReader: Reader;
  NfcReaderCreation: Omit<NfcReaderCreation, 'reader'> & { reader: ResolversParentTypes['NfcReader'] };
  NfcReaderUpdatedWhereInput: NfcReaderUpdatedWhereInput;
  NfcRemovalInput: NfcRemovalInput;
  NfcTag: Omit<NfcTag, 'guest'> & { guest?: Maybe<ResolversParentTypes['GuestType']> };
  Query: {};
  ReadersFilterInput: ReadersFilterInput;
  Session: Session;
  String: Scalars['String'];
  Subscription: {};
  UpdateGuestInput: UpdateGuestInput;
  UpdateNfcReaderInput: UpdateNfcReaderInput;
  User: User;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EntryTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntryType'] = ResolversParentTypes['EntryType']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  guest?: Resolver<ResolversTypes['GuestType'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reader?: Resolver<ResolversTypes['NfcReader'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuestTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuestType'] = ResolversParentTypes['GuestType']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tagUid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createEntry?: Resolver<ResolversTypes['EntryType'], ParentType, ContextType, RequireFields<MutationCreateEntryArgs, 'input'>>;
  createGuest?: Resolver<ResolversTypes['GuestType'], ParentType, ContextType, RequireFields<MutationCreateGuestArgs, 'input'>>;
  createNfcReader?: Resolver<ResolversTypes['NfcReaderCreation'], ParentType, ContextType, RequireFields<MutationCreateNfcReaderArgs, 'input'>>;
  deleteEntry?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteEntryArgs, 'id'>>;
  deleteGuest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteGuestArgs, 'id'>>;
  deleteNfcReader?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteNfcReaderArgs, 'id'>>;
  login?: Resolver<ResolversTypes['Session'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  submitNfcPlacement?: Resolver<ResolversTypes['NfcReader'], ParentType, ContextType, RequireFields<MutationSubmitNfcPlacementArgs, 'input'>>;
  submitNfcReaderKeepAlive?: Resolver<ResolversTypes['NfcReader'], ParentType, ContextType>;
  submitNfcRemoval?: Resolver<ResolversTypes['NfcReader'], ParentType, ContextType, RequireFields<MutationSubmitNfcRemovalArgs, 'input'>>;
  updateGuest?: Resolver<ResolversTypes['GuestType'], ParentType, ContextType, RequireFields<MutationUpdateGuestArgs, 'input'>>;
  updateNfcReader?: Resolver<ResolversTypes['NfcReader'], ParentType, ContextType, RequireFields<MutationUpdateNfcReaderArgs, 'input'>>;
};

export type NfcReaderResolvers<ContextType = any, ParentType extends ResolversParentTypes['NfcReader'] = ResolversParentTypes['NfcReader']> = {
  currentTag?: Resolver<Maybe<ResolversTypes['NfcTag']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastSeenAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tracksEntries?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NfcReaderCreationResolvers<ContextType = any, ParentType extends ResolversParentTypes['NfcReaderCreation'] = ResolversParentTypes['NfcReaderCreation']> = {
  reader?: Resolver<ResolversTypes['NfcReader'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NfcTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['NfcTag'] = ResolversParentTypes['NfcTag']> = {
  guest?: Resolver<Maybe<ResolversTypes['GuestType']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  entries?: Resolver<Array<ResolversTypes['EntryType']>, ParentType, ContextType, Partial<QueryEntriesArgs>>;
  guests?: Resolver<Array<ResolversTypes['GuestType']>, ParentType, ContextType>;
  readers?: Resolver<Array<ResolversTypes['NfcReader']>, ParentType, ContextType, Partial<QueryReadersArgs>>;
};

export type SessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  entryCreated?: SubscriptionResolver<ResolversTypes['EntryType'], "entryCreated", ParentType, ContextType, Partial<SubscriptionEntryCreatedArgs>>;
  guestUpdated?: SubscriptionResolver<ResolversTypes['GuestType'], "guestUpdated", ParentType, ContextType>;
  nfcReaderUpdated?: SubscriptionResolver<ResolversTypes['NfcReader'], "nfcReaderUpdated", ParentType, ContextType, Partial<SubscriptionNfcReaderUpdatedArgs>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  EntryType?: EntryTypeResolvers<ContextType>;
  GuestType?: GuestTypeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NfcReader?: NfcReaderResolvers<ContextType>;
  NfcReaderCreation?: NfcReaderCreationResolvers<ContextType>;
  NfcTag?: NfcTagResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

