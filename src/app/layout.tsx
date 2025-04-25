import "@uploadthing/react/styles.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

import { ClerkProvider } from "@clerk/nextjs";

import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import "../../public/fonts/css/fontawesome.min.css";
import "../../public/fonts/css/solid.min.css";

export const metadata: Metadata = {
  title: "OnlyDogs",
  description: "Dog Dating Website",
  icons: [{ rel: "icon", url: "/Logo.png" }],
};

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={geist.className}>
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
