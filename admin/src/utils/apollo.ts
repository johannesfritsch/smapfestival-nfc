import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const authLink = setContext((_, { headers }) => {
  if ("localStorage" in global) {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  } else {
    return {};
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log(graphQLErrors, networkError);
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path, extensions }) => {
      if (
        extensions &&
        extensions.code === "UNAUTHORIZED" &&
        window.location.pathname !== "/login"
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login?redirect=" + window.location.pathname;
      }
    });
});

const httpLink = authLink.concat(errorLink).concat(
  new HttpLink({
    uri: "http://localhost:4000/graphql",
  })
);

const createClientLink = () => {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: "ws://localhost:4000/graphql",
      connectionParams: () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
    })
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  return authLink.concat(errorLink).concat(splitLink);
};

export const apolloClient = new ApolloClient({
  link: typeof window === "undefined" ? httpLink : createClientLink(),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          entries: {
            keyArgs: false,
            merge(existing, incoming) {
              console.log(existing, incoming);
              return [
                ...(existing ? existing : []),
                ...(incoming ? incoming : []),
              ];
            },
          },
        },
      },
    },
  }),
});
