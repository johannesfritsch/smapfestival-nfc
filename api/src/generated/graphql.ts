import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateNfcReaderInput = {
  name: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createNfcReader: NfcReaderCreation;
  deleteNfcReader: Scalars['Boolean'];
  login: Session;
  submitNfcPlacement: NfcReader;
  submitNfcRemoval: NfcReader;
};


export type MutationCreateNfcReaderArgs = {
  input: CreateNfcReaderInput;
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

export type NfcPlacementInput = {
  tagUid: Scalars['ID'];
};

export type NfcReader = {
  __typename?: 'NfcReader';
  currentTag?: Maybe<NfcTag>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type NfcReaderCreation = {
  __typename?: 'NfcReaderCreation';
  reader: NfcReader;
  token: Scalars['String'];
};

export type NfcRemovalInput = {
  tagUid: Scalars['ID'];
};

export type NfcTag = {
  __typename?: 'NfcTag';
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  readers: Array<NfcReader>;
};

export type Session = {
  __typename?: 'Session';
  token: Scalars['String'];
  user: User;
};

export type Subscription = {
  __typename?: 'Subscription';
  nfcReaderUpdated: NfcReader;
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
  CreateNfcReaderInput: CreateNfcReaderInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  NfcPlacementInput: NfcPlacementInput;
  NfcReader: ResolverTypeWrapper<NfcReader>;
  NfcReaderCreation: ResolverTypeWrapper<NfcReaderCreation>;
  NfcRemovalInput: NfcRemovalInput;
  NfcTag: ResolverTypeWrapper<NfcTag>;
  Query: ResolverTypeWrapper<{}>;
  Session: ResolverTypeWrapper<Session>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateNfcReaderInput: CreateNfcReaderInput;
  ID: Scalars['ID'];
  LoginInput: LoginInput;
  Mutation: {};
  NfcPlacementInput: NfcPlacementInput;
  NfcReader: NfcReader;
  NfcReaderCreation: NfcReaderCreation;
  NfcRemovalInput: NfcRemovalInput;
  NfcTag: NfcTag;
  Query: {};
  Session: Session;
  String: Scalars['String'];
  Subscription: {};
  User: User;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createNfcReader?: Resolver<ResolversTypes['NfcReaderCreation'], ParentType, ContextType, RequireFields<MutationCreateNfcReaderArgs, 'input'>>;
  deleteNfcReader?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteNfcReaderArgs, 'id'>>;
  login?: Resolver<ResolversTypes['Session'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  submitNfcPlacement?: Resolver<ResolversTypes['NfcReader'], ParentType, ContextType, RequireFields<MutationSubmitNfcPlacementArgs, 'input'>>;
  submitNfcRemoval?: Resolver<ResolversTypes['NfcReader'], ParentType, ContextType, RequireFields<MutationSubmitNfcRemovalArgs, 'input'>>;
};

export type NfcReaderResolvers<ContextType = any, ParentType extends ResolversParentTypes['NfcReader'] = ResolversParentTypes['NfcReader']> = {
  currentTag?: Resolver<Maybe<ResolversTypes['NfcTag']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NfcReaderCreationResolvers<ContextType = any, ParentType extends ResolversParentTypes['NfcReaderCreation'] = ResolversParentTypes['NfcReaderCreation']> = {
  reader?: Resolver<ResolversTypes['NfcReader'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NfcTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['NfcTag'] = ResolversParentTypes['NfcTag']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  readers?: Resolver<Array<ResolversTypes['NfcReader']>, ParentType, ContextType>;
};

export type SessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  nfcReaderUpdated?: SubscriptionResolver<ResolversTypes['NfcReader'], "nfcReaderUpdated", ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Mutation?: MutationResolvers<ContextType>;
  NfcReader?: NfcReaderResolvers<ContextType>;
  NfcReaderCreation?: NfcReaderCreationResolvers<ContextType>;
  NfcTag?: NfcTagResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

