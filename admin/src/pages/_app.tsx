import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "../utils/apollo";
import App, { AppProps, AppContext } from "next/app";
import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

import "../globals.css";
import dynamic from "next/dynamic";

const apolloClient = createApolloClient({
  httpApiUrl: publicRuntimeConfig.apiUrl.http,
  wsApiUrl: publicRuntimeConfig.apiUrl.ws,
});

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (context: AppContext) => {
  const ctx = App.getInitialProps(context); // error: Argument of type 'NextPageContext' is not assignable to parameter of type 'AppContext'.

  return { ctx };
};

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
