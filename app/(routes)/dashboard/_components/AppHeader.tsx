import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import Link from "next/link";
const menuOptions = [
  {
    id: 1,
    name: "Home",
    path: "/dashboard",
  },
  {
    id: 2,
    name: "History",
    path: "/dashboard/history",
  },
  {
    id: 3,
    name: "Pricing",
    path: "/dashboard/billing",
  },
  {
    id: 4,
    name: "Profile",
    path: "/profile",
  },
];
function AppHeader() {
  return (
    <div className="flex items-center justify-between p-4 shadow px-10 md:px-20 lg:px-40 xl:px-40">
      <h1 className="text-2xl font-bold flex items-center gap-2">🧠 MediVoice AI</h1>

      <div className=" hidden md:flex gap-12 items-center">
        {menuOptions.map((option, index) => (
          <div key={index}>
            <Link key={index} href={option.path}>
              <h2 className="hover:font-bold cursor-pointer">{option.name}</h2>
            </Link>
          </div>
        ))}
      </div>
      <UserButton />
    </div>
  );
}

export default AppHeader;
