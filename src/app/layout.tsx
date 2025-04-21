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
        <body className={geist.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
