import type { AppProps } from "next/app";

import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "../styles/theme";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={new QueryClient()}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
