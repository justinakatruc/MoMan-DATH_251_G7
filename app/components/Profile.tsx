"use client";

import { User } from 'lucide-react'
import { useState } from 'react';
import { ProfileCard } from './ProfileCard';


interface ProfileProps {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    memberSince: string;
    accountType: string;
}

export default function Profile({ 
    id, firstName , lastName, email, memberSince, accountType }: ProfileProps) 
{
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div 
                className={`rounded-full border-2 flex items-center justify-center cursor-pointer size-[40px] bg-[#CFF0E7]`}
                onClick={() => setIsOpen(true)}
            >
                <User className="size-[20px]" />
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
