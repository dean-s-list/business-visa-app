import "@/src/styles/globals.css";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

import ToastNotification from "../components/common/ToastNotification";
import WalletContextProvider from "../context/WalletContextProvider";
import theme from "../theme";
import Footer from "@/src/components/common/Footer";
import Header from "@/src/components/common/Header";

const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 2 } },
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <SessionProvider session={pageProps?.session}>
                    <WalletContextProvider>
                        <Head>
                            <link rel="icon" href="/favicon.ico" />
                            <meta
                                name="viewport"
                                content="width=device-width, initial-scale=1"
                            />
                        </Head>
                        <Box
                            color="gray.50"
                            bgColor="gray.900"
                            minH="100dvh"
                            display="flex"
                            flexDirection="column"
                        >
                            {/* header */}
                            <Header />

                            {/* pages */}
                            <Box flexGrow={1}>
                                <Component {...pageProps} />
                            </Box>

                            {/* footer */}
                            <Footer />

                            {/* toast notification */}
                            <ToastNotification />

                            {/* react query devtools */}
                            <ReactQueryDevtools initialIsOpen={false} />
                        </Box>
                    </WalletContextProvider>
                </SessionProvider>
            </ChakraProvider>
        </QueryClientProvider>
    );
}
