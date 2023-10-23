import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import { atkinsonHyperlegible } from "@/lib/fonts";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Clerk Webhooks - Your Next.js project kickstarter",
  metadataBase: new URL(SITE_URL),
  themeColor: [
    {
      color: "#020817",
      media: "dark",
    },
    {
      color: "#F7F2F2",
      media: "light",
    },
  ],
  authors: {
    name: "Vighnesh Gupta",
    url: new URL("https://vigneshgupta.vercel.app/"),
  },
  creator: "Vighnesh Gupta",
  colorScheme: "dark light",
  keywords: ["nextjs", "frontend", "starter", "vignesh", "react", "vercel" , "shadcn" , "clerk" , "prisma"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={atkinsonHyperlegible.className}
          suppressHydrationWarning
        >
          <Providers
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
