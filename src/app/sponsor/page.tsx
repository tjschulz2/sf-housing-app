import Link from "next/link";
import Image from "next/image";
import userResponseImg from "../../../public/images/sponsorship/user-response.png";
import productStats from "../../../public/images/sponsorship/stats.png";
import { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const siteTitle = "Sponsor DirectorySF";
const siteImage = "/images/meta/og-sponsor.png";
const siteURL = "https://www.directorysf.com/";

export const metadata: Metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : new URL(`http://localhost:${process.env.PORT || 3000}`),
  title: siteTitle,
  authors: [
    { name: "Thomas Schulz", url: "https://twitter.com/thomasschulzz" },
    { name: "Neall Seth", url: "https://neall.org" },
  ],
  openGraph: {
    title: siteTitle,
    url: siteURL,
    siteName: siteTitle,
    images: siteImage,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    images: [siteImage],
  },
};

export default function SponsorPage() {
  return (
    <div className="bg-[#FEFBEB]">
      <div className="prose max-w-prose mx-auto py-8 px-4">
        <h1 className="">Sponsor DirectorySF! 🏡</h1>
        <p>
          The curated housing (+ jobs) platform for the Bay Area{" "}
          <Link target="_blank" href="https://bayarea.wiki/megascene">
            Megascene
          </Link>
        </p>

        <Image
          className="w-full mb-0"
          src={userResponseImg}
          alt="user response"
        ></Image>
        <span className="text-xs text-gray-500 italic">
          We&apos;re lucky to get these messages so often
        </span>

        <h2>TL;DR</h2>
        <p>
          <Link target="_blank" href="/">
            DirectorySF
          </Link>{" "}
          is open to sponsorship and donations. Your brand will be exposed to
          our curated community of Bay Area founders and engineers.
        </p>

        <h2>Why it matters</h2>
        <ol>
          <li>
            Incredible things grow from dense clusters of{" "}
            <span className="italic">curious, optimistic, ambitious</span>{" "}
            people.
          </li>
          <li>
            Development of these clusters is stunted by inherent coordination
            complexity.
          </li>
          <li>
            DSF makes the housing sorting process as frictionless as possible
            (it&apos;s why we charge users{" "}
            <span className="italic">nothing</span>, and why this page exists!)
          </li>
        </ol>
        <p>
          Thread with expanded thoughts{" "}
          <Link
            target="_blank"
            href="https://x.com/neallseth/status/1793757914542317892"
          >
            here
          </Link>
          .{" "}
        </p>
        <h2>Community statistics</h2>
        <Image
          className="mb-0"
          alt="DSF usage stats"
          src={productStats}
        ></Image>
        <span className="text-xs text-gray-500 italic">
          Statistics from the past 90 days, as of 11/1/24
        </span>
        <ul>
          <li>
            Most of our members are{" "}
            <span className="font-bold">
              early stage founders and engineers.
            </span>
            <ul>
              <li>
                Other represented groups include: rationality/EA, Burners, and
                anonymous Twitter shitposters.
              </li>
            </ul>
          </li>

          <li>Acceptance rate is roughly 60%</li>
          <li>
            Over <span className="font-bold">500</span> housing placements have
            been made in the last year!
          </li>
        </ul>
        <h2>Sponsorship ideas</h2>
        <p>
          This is <span className="italic">roughly</span> what sponsorship could
          look like. More than happy to chat about custom arrangements!
        </p>
        <Table className="text-xs md:text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Tier</TableHead>
              <TableHead className="text-center">$ / mo</TableHead>
              <TableHead className="text-center">In-app banner</TableHead>
              <TableHead className="text-center">
                Landing page mention
              </TableHead>
              <TableHead className="text-center">Job listing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-center font-medium">
                Friend 🤗
              </TableCell>
              <TableCell className="text-center">Up to you!</TableCell>
              <TableCell className="text-center">⚪</TableCell>
              <TableCell className="text-center">⚪</TableCell>
              <TableCell className="text-center">✅</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center font-medium">
                Silver 🥈
              </TableCell>
              <TableCell className="text-center">$500</TableCell>
              <TableCell className="text-center">⚪</TableCell>
              <TableCell className="text-center">✅ (small)</TableCell>
              <TableCell className="text-center">✅</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center font-medium">Gold 🥇</TableCell>
              <TableCell className="text-center">$1,000</TableCell>
              <TableCell className="text-center">✅ (one page)</TableCell>
              <TableCell className="text-center">✅ (medium)</TableCell>
              <TableCell className="text-center">✅</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center font-medium">
                Diamond 💎
              </TableCell>
              <TableCell className="text-center">$2,000</TableCell>
              <TableCell className="text-center">✅ (two pages)</TableCell>
              <TableCell className="text-center">✅ (large)</TableCell>
              <TableCell className="text-center">✅</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h2>Why you might sponsor</h2>
        <ol>
          <li>You care about the mission, or San Francisco generally</li>
          <li>Your brand benefits from exposure to our community</li>
          <ul>
            <li>
              Highly targeted channel for reaching SF-based founders and
              engineers
            </li>
            <li>
              <span className="italic">
                Hint hint - seeking venture deal flow? Recruiting engineers?
                Selling to HNIs?
              </span>
            </li>
          </ul>
          <li>
            You&apos;ve personally benefited from using DSF and want to give
            back
          </li>
        </ol>
        <h2>Let&apos;s chat</h2>
        <p>
          Feel free to DM on Twitter (
          <Link target="_blank" href="https://x.com/neallseth/">
            @neallseth
          </Link>
          )
        </p>
        <p>
          If you&apos;d like to make a one-off donation,{" "}
          <Link target="_blank" href="https://venmo.com/NeallSeth">
            Venmo
          </Link>{" "}
          and{" "}
          <Link
            target="_blank"
            href="https://donate.stripe.com/00g4kcgAuaMybSw4gi"
          >
            Stripe
          </Link>{" "}
          work well!
        </p>
      </div>
    </div>
  );
}
