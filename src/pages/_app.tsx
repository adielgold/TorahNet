import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "stream-chat-react/dist/css/v2/index.css";
import "../components/Chat/overrides/MessagingSidebar/MessagingSidebar.theme.css";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import StreamProvider from "@/context/StreamVideoClient";
import ClientWrapper from "@/components/ClientWrapper/ClientWrapper";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as gtag from "@/lib/gtag";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

// Google Analytics tracking ID
const GA_TRACKING_ID = "G-XKGVY0D3NR";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Track page views when the route changes
    const handleRouteChange = (url: string) => {
      if (typeof window !== "undefined") {
        gtag.pageview(url);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <StreamProvider>
      {/* <PayPalScriptProvider
        options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}
      > */}
      <main className={`m-auto flex w-full flex-col ${poppins.className}`}>
        <Toaster />
        <ShadcnToaster />
        <ClientWrapper>
          <Component {...pageProps} />{" "}
        </ClientWrapper>
      </main>
      {/* </PayPalScriptProvider> */}
    </StreamProvider>
  );
}
