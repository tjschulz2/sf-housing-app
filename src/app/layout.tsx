import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import LoadingSpinner from "../components/loading-spinner/loading-spinner";
import { Suspense } from "react";
import Script from "next/script";
const GTM_ID = "GTM-KBH5Q942";

const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster";

const siteTitle = "DirectorySF";
const siteDescription =
  "The SF housing directory with people you probably know";
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
        <Suspense fallback={<LoadingSpinner />}>
          {children}
          <Toaster />
        </Suspense>
      </body>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
    </html>
  );
}
