import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../utils/apollo";
import { AppProps } from "next/app";

import '../globals.css'
import dynamic from "next/dynamic";

function MyApp({ Component, pageProps } : AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});