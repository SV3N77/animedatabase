import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="grow bg-neutral-100">
        <QueryClientProvider client={client}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </div>
      <Footer />
    </div>
  );
}

export default MyApp;
