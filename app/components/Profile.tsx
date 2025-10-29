"use client";

import { User } from 'lucide-react'
import { useState } from 'react';
import { ProfileCard } from './ProfileCard';
import { usePathname } from 'next/navigation';


interface ProfileProps {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    memberSince?: string;
    accountType?: string;
}

export default function Profile({ 
    id = 1, firstName = 'John', lastName = 'Doe', email = 'john.doe@example.com', memberSince = '2022-01-15', accountType = 'Student' }: ProfileProps) 
{
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <div 
                className={`rounded-full border-2 flex items-center justify-center cursor-pointer  ${pathname.includes('/admin') ? 'size-[40px] bg-[#07B681] text-white font-bold' : 'size-[48px] bg-[#CFF0E7]'}`}
                onClick={() => setIsOpen(true)}
            >
                <User className="size-[24px]" />
            </div>
            {
                isOpen && (
                    <ProfileCard
                        user={{ id, firstName, lastName, email, memberSince, accountType }}
                        setIsOpen={setIsOpen}
                    />
                )
            }
        </>
    )
}
