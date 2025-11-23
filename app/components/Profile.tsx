"use client";

import { User } from "lucide-react";
import { useState } from "react";
import { ProfileCard } from "./ProfileCard";

interface ProfileProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  memberSince: string;
  accountType: string;
  size1: string;
  size2: string;
}

export default function Profile({
  id,
  firstName,
  lastName,
  email,
  memberSince,
  accountType,
  size1,
  size2,
}: ProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`rounded-full border-2 flex items-center justify-center cursor-pointer ${size1} bg-[#CFF0E7]`}
        onClick={() => setIsOpen(true)}
      >
        <User className={`${size2}`} />
      </div>
      {isOpen && (
        <ProfileCard
          user={{ id, firstName, lastName, email, memberSince, accountType }}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
}
