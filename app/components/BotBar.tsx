import {
  ArrowRightLeft,
  ChartLine,
  House,
  Layers,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function BotBar() {
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
    <div className="bg-[#F1FFF3]">
      <div className="w-full h-[108px] bg-[#DFF7E2] px-[60px] pt-9 pb-10 flex items-center gap-x-5 justify-center rounded-tl-[80px] rounded-tr-[80px]">
        {menuList.map((menu) => (
          <a
            key={menu.name}
            href={menu.link}
            className={`h-[53px] w-[57px] flex items-center justify-center text-[#000000] text-sm font-medium rounded-[10px]
            ${pathname === menu.link ? "bg-[#00D09E]" : ""}`}
          >
            <menu.icon className="w-6 h-6" />
          </a>
        ))}
      </div>
    </div>
  );
}
