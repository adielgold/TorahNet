import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "stream-chat-react/dist/css/v2/index.css";
import "../components/Chat/overrides/MessagingSidebar/MessagingSidebar.theme.css";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import StreamProvider from "@/context/StreamVideoClient";
import ClientWrapper from "@/components/ClientWrapper/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StreamProvider>
      <main className={`flex flex-col w-full  m-auto ${inter.className}`}>
        <Toaster />
        <ShadcnToaster />
        <ClientWrapper>
          <Component {...pageProps} />{" "}
        </ClientWrapper>
      </main>
    </StreamProvider>
  );
}
