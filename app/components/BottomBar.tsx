import {
  ArrowRightLeft,
  ChartLine,
  House,
  Layers,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomBar() {
  const pathname = usePathname();

  const menuList = [
    { name: "Home", icon: House, link: "/home" },
    { name: "Analysis", icon: ChartLine, link: "/analysis" },
    {
      name: "Transactions",
      icon: ArrowRightLeft,
      link: "/transactions",
    },
    { name: "Category", icon: Layers, link: "/category" },
    { name: "Profile", icon: UserRound, link: "/profile" },
  ];

  return (
    <div className="bg-[#F1FFF3] w-[430px]">
      <div className="h-[85px] bg-[#DFF7E2] flex items-center justify-center gap-x-4 rounded-tl-[50px] rounded-tr-[50px]">
        {menuList.map((menu) => (
          <a
            key={menu.name}
            href={menu.link}
            className={`h-[50px] w-[50px] flex items-center justify-center text-[#000000] text-sm font-medium rounded-[10px]
            ${
              pathname === menu.link
                ? "bg-[#00D09E]"
                : (pathname === "/analysis/report" ||
                    pathname === "/analysis/search") &&
                  menu.link === "/analysis"
                ? "bg-[#00D09E]"
                : ""
            }`}
          >
            <menu.icon className="w-6 h-6" />
          </a>
        ))}
      </div>
    </div>
  );
}
