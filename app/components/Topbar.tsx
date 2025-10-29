"use client";
import { usePathname } from "next/navigation";
import TransactionButton from "./TransactionButton";
import Profile from "./Profile";

export default function Topbar() {
    const pathname = usePathname();
    function getName(slug: string): string {
        const lastPart = slug.split("/").filter(Boolean).pop() || "";

        return lastPart
            .replace(/-/g, " ")
            .replace(/&/g, " & ")
            .trim()
            .replace(/\s+/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());
    }
    const pageName = getName(pathname);

    return (
        <>
            <div className="w-full hidden lg:flex px-6 h-16 mt-8 flex-row justify-between items-center">
                <h1 className="text-4xl font-bold text-gray-800">{pageName}</h1>
                {pageName === "Home" ? <h1 className="text-3xl font-bold text-gray-800">username</h1> : <></>}
                <div className="flex flex-row space-x-4">
                    <TransactionButton />
                    <Profile />
                </div>
            </div>
            <div className="w-full lg:hidden flex flex-row justify-between items-top">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-800">{pageName}</h1> 
                    {pageName === "Home" ? <h1 className="text-xl font-bold text-gray-800">username</h1> : <></>}
                </div>
                <div className="flex flex-row space-x-4">
                    <TransactionButton />
                    <Profile />
                </div>
            </div>
        </>
    )
}
