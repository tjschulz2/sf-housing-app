"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./navbar.module.css";

const navConfig = [
  {
    path: "/directory",
    title: "People",
  },
  // {
  //   path: "/directory/people-organizing",
  //   title: "Starting a new house",
  // },
  {
    path: "/directory/rooms",
    title: "Rooms",
  },
  // {
  //   path: "/directory/homes",
  //   title: "Entire Homes",
  // },
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
                ? "font-bold text-[#1d462f] border-2 border-[#1d462f] bg-[#e7e9d8]"
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
