"use client";

import {
  ArrowRightLeft,
  ChartLine,
  House,
  Layers,
  UserRound,
  Plus,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAddPage = pathname === "/transactions/add";
  const isTransactionPage = pathname === "/transactions";

  const handleToggleType = () => {
    const currentType = searchParams.get("type");
    const newType = currentType === "income" ? "expense" : "income";
    router.replace(`${pathname}?type=${newType}`);
  };

  const menuList = [
    { name: "Home", icon: House, link: "/home" },
    { name: "Analysis", icon: ChartLine, link: "/analysis" },
    {
      name: "Action",
      icon: ArrowRightLeft,
      link: isTransactionPage ? "/transactions/add" : "/transactions",
    },
    { name: "Category", icon: Layers, link: "/category" },
    { name: "Profile", icon: UserRound, link: "/profile" },
  ];

  return (
    <div className="bg-[#F1FFF3] w-[430px] fixed bottom-0 left-0 right-0 mx-auto z-40">
      <div className="h-[85px] bg-[#DFF7E2] flex items-center justify-around px-2 rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        {menuList.map((menu, index) => {
          const isMiddleButton = index === 2;

          const isActive =
            pathname === menu.link ||
            (menu.link === "/analysis" && pathname.startsWith("/analysis"));

          if (isMiddleButton) {
            if (isAddPage) {
              return (
                <button
                  key={menu.name}
                  onClick={handleToggleType}
                  className="h-[60px] w-[60px] bg-[#00D09E] rounded-full flex items-center justify-center text-white -mt-8 shadow-lg border-4 border-[#F1FFF3] active:scale-95 transition-transform"
                >
                  <menu.icon className="w-8 h-8" />
                </button>
              );
            }

            if (isTransactionPage) {
              return (
                <Link
                  key={menu.name}
                  href="/transactions/add"
                  className="h-[60px] w-[60px] bg-[#00D09E] rounded-full flex items-center justify-center text-white -mt-8 shadow-lg border-4 border-[#F1FFF3] active:scale-95 transition-transform"
                >
                  <Plus className="w-8 h-8" />
                </Link>
              );
            }
          }

          return (
            <Link
              key={menu.name}
              href={menu.link}
              className={`h-[50px] w-[50px] flex items-center justify-center rounded-[14px] transition-colors
              ${
                isActive
                  ? "bg-[#00D09E] text-white"
                  : "text-[#052224] hover:bg-[#DFF7E2]"
              }`}
            >
              <menu.icon className="w-6 h-6" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
