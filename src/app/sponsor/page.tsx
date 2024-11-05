import Link from "next/link";
import Image from "next/image";
import userResponseImg from "../../../public/images/sponsorship/user-response.png";
import productStats from "../../../public/images/sponsorship/stats.png";
import { Metadata } from "next";

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
          A curated housing platform for the Bay Area{" "}
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
            DSF eases this complexity, making the housing sorting process as
            frictionless as possible (it’s why we charge users{" "}
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
            Most of our members are founders, or early stage startup employees.
            <ul>
              <li>
                Other represented groups include: rationality/EA, Burners, and
                anonymous Twitter shitposters.
              </li>
            </ul>
          </li>

          <li>Acceptance rate is roughly 60%</li>
          <li>
            Over <span className="font-bold">400</span> housing placements have
            been made in the last year!
          </li>
        </ul>
        <h2>Sponsorship ideas</h2>
        <p>
          This is <span className="italic">roughly</span> what sponsorship could
          look like. More than happy to chat about custom arrangements!
        </p>
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 border-b text-center align-middle font-semibold">
                  Tier
                </th>
                <th className="py-3 px-4 border-b text-center align-middle font-semibold">
                  $ / mo
                </th>
                <th className="py-3 px-4 border-b text-center align-middle font-semibold">
                  In-app banner
                </th>
                <th className="py-3 px-4 border-b text-center align-middle font-semibold">
                  Sponsors section (landing page)
                </th>
                <th className="py-3 px-4 border-b text-center align-middle font-semibold">
                  Sponsors section (GitHub repo)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-700 font-medium text-center align-middle">
                  Friend 🤗
                </td>
                <td className="py-3 px-4 text-gray-700 text-center align-middle">
                  Up to you!
                </td>
                <td className="py-3 px-4 text-center align-middle text-red-500">
                  ⭕
                </td>
                <td className="py-3 px-4 text-center align-middle">
                  ✅ (small)
                </td>
                <td className="py-3 px-4 text-center align-middle">✅</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-700 font-medium text-center align-middle">
                  Silver 🥈
                </td>
                <td className="py-3 px-4 text-gray-700 text-center align-middle">
                  $500
                </td>
                <td className="py-3 px-4 text-center align-middle text-red-500">
                  ⭕
                </td>
                <td className="py-3 px-4 text-center align-middle">
                  ✅ (medium)
                </td>
                <td className="py-3 px-4 text-center align-middle">✅</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-gray-700 font-medium text-center align-middle">
                  Gold 🥇
                </td>
                <td className="py-3 px-4 text-gray-700 text-center align-middle">
                  $1,000
                </td>
                <td className="py-3 px-4 text-center align-middle">
                  ✅ (single)
                </td>
                <td className="py-3 px-4 text-center align-middle">
                  ✅ (large)
                </td>
                <td className="py-3 px-4 text-center align-middle">✅</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700 font-medium text-center align-middle">
                  Diamond 💎
                </td>
                <td className="py-3 px-4 text-gray-700 text-center align-middle">
                  $2,000
                </td>
                <td className="py-3 px-4 text-center align-middle">✅</td>
                <td className="py-3 px-4 text-center align-middle">
                  ✅ (x-large)
                </td>
                <td className="py-3 px-4 text-center align-middle">✅</td>
              </tr>
            </tbody>
          </table>
        </div>

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
            You’ve personally benefited from using DSF and want to give back
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
          If you&apos;d like to make a donation or payment for sponsorship,
          Venmo (
          <Link target="_blank" href="https://account.venmo.com/u/neallseth">
            @NeallSeth
          </Link>
          )
        </p>
      </div>
    </div>
  );
}
