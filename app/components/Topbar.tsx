"use client";
import { usePathname } from "next/navigation";
import TransactionButton from "./TransactionButton";

export default function Topbar() {
    const pathname = usePathname();
    function getName(slug: string): string {
        let name = slug.split("/")[1];
        name = name.replace(/-/g, ' ');

        name = name.replace(/&/g, ' & ');

        name = name.trim().replace(/\s+/g, ' ');

        return name.replace(/\b\w/g, char => char.toUpperCase());
    }
    const pageName = getName(pathname);

    return (
        <>
            <div className="w-full hidden lg:flex px-6 h-16 mt-8 flex-row justify-between items-center">
                <h1 className="text-4xl font-bold text-gray-800">{pageName}</h1>
                {pageName === "Home" ? <h1 className="text-3xl font-bold text-gray-800">username</h1> : <></>}
                <div className="flex flex-row space-x-4">
                    <TransactionButton />
                </div>
            </div>
            <div className="w-full lg:hidden flex flex-row justify-between items-top">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-800">{pageName}</h1> 
                    {pageName === "Home" ? <h1 className="text-xl font-bold text-gray-800">username</h1> : <></>}
                </div>
                <TransactionButton />
            </div>
        </>
    )
}
