"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./navbar.module.css";

const navConfig = [
  {
    path: "/searchers",
    title: "Searchers",
  },
  {
    path: "/rooms",
    title: "Rooms",
  },
  {
    path: "/jobs",
    title: "Jobs",
  },

  {
    path: "/members",
    title: "Members",
  },
];

export default function Navbar() {
  const currentPath = usePathname();

  return (
    <div className="flex justify-center sm:justify-start">
      <div className="flex gap-2">
        {navConfig.map((tab) => (
          <Link
            key={tab.path}
            href={tab.path}
            className={`no-underline rounded-md py-1.5 px-3 ${
              tab.path === currentPath
                ? "font-bold text-solarisgreen border-2 border-solarisgreen bg-solarisgreen-light"
                : "text-[#474747] border border-[#cccccc] hover:bg-[#f1efdf]"
            }`}
          >
            {tab.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
