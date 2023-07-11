import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

const siteTitle = "DirectorySF";
const siteDescription =
  "An invite-only directory of people you probably know that are looking for housing in San Francisco.";
const siteImage = "/sfd.png";
const siteURL = "https://www.directorysf.com/";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  authors: [
    { name: "Thomas Schulz", url: "https://twitter.com/thomasschulzz" },
    { name: "Neall Seth", url: "https://neall.org" },
  ],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteURL,
    siteName: siteTitle,
    images: siteImage,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [siteImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </body>
    </html>
  );
}
