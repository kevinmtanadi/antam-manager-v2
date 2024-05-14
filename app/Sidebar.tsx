"use client";

import React, { useEffect, useState } from "react";
import classname from "classnames";
import { IconType } from "react-icons";
import { AiFillHome } from "react-icons/ai";
import Link from "next/link";
import { GiHamburgerMenu, GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import { IoGridOutline } from "react-icons/io5";
import { TbShoppingBag } from "react-icons/tb";
import { MdLogout, MdOutlineCreditCard } from "react-icons/md";
import { LuLayoutGrid, LuScrollText } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";

interface Tab {
  label: string;
  icon: IconType;
  target: string;
}

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const currentPath = usePathname();

  const [expandable, setExpandable] = useState(false);
  useEffect(() => {
    const threshold = 850;
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      setExpandable(screenWidth > threshold);
      if (screenWidth <= threshold) {
        setExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const overviewTabs: Tab[] = [
    {
      label: "Dashboard",
      icon: LuLayoutGrid,
      target: "/",
    },
    {
      label: "Produk & Stok",
      icon: TbShoppingBag,
      target: "/product",
    },
    {
      label: "Pembelian",
      icon: GiPayMoney,
      target: "/purchase",
    },
    {
      label: "Penjualan",
      icon: GiReceiveMoney,
      target: "/sales",
    },
    {
      label: "Histori Transaksi",
      icon: LuScrollText,
      target: "/transaction_history",
    },
    {
      label: "Akun",
      icon: FiUsers,
      target: "/users",
    },
  ];

  const otherTabs: Tab[] = [
    {
      label: "Keluar",
      icon: MdLogout,
      target: "/logout",
    },
  ];

  return (
    <div
      className={classname({
        "min-w-[65px] h-screen transition-all border-r overflow-hidden sticky top-0":
          true,
      })}
    >
      <div className="flex mb-4 border-b py-4 px-3 items-center">
        <button
          className="w-10 h-10 flex justify-center border-2 rounded-md border-amber-500"
          onClick={() => {
            expandable && setExpanded(!expanded);
          }}
        >
          <Image src={Logo} alt="Logo" width={24} height={24} />
        </button>
        <span
          className={classname({
            "overflow-hidden whitespace-nowrap transition-all font-semibold":
              true,
            "w-52 ml-3": expanded,
            "w-0": !expanded,
          })}
        >
          Antam Manager
        </span>
        {expanded && (
          <button onClick={() => setExpanded(false)}>
            <GoChevronLeft className="p-1" size={"1.75rem"} />
          </button>
        )}
      </div>
      <div>
        <div
          className={classname({
            "text-gray-400 ml-3 overflow-hidden transition-all whitespace-nowrap text-xs px-3":
              true,
            "w-0 text-transparent": !expanded,
          })}
        >
          OVERVIEW
        </div>
        <div className="border-b px-3">
          {overviewTabs.map((tab) => (
            <SidebarItem
              key={tab.target}
              tab={tab}
              active={currentPath === tab.target}
              expanded={expanded}
            />
          ))}
        </div>
        <div>
          <div
            className={classname({
              "mt-4 text-gray-400 ml-3 overflow-hidden transition-all whitespace-nowrap text-xs px-3":
                true,
              "w-0 text-transparent": !expanded,
            })}
          >
            OTHERS
          </div>
          <div className="border-b px-3">
            {otherTabs.map((tab) => (
              <SidebarItem
                key={tab.target}
                tab={tab}
                active={currentPath === tab.target}
                expanded={expanded}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  tab: Tab;
  active: boolean;
  expanded: boolean;
}
const SidebarItem = ({ tab, active, expanded }: SidebarItemProps) => {
  return (
    <Link key={tab.label} href={tab.target}>
      <div
        className={classname({
          "flex my-2 rounded-md p-2.5 hover:text-blue-500 hover:bg-blue-200 transition-colors":
            true,
          "bg-gray-200": active,
        })}
      >
        <div>
          <tab.icon className="transition-colors" size={"1.2rem"} />
        </div>
        <div
          className={classname({
            "transition-all h-5 overflow-hidden whitespace-nowrap text-sm":
              true,
            "ml-3": expanded,
            "w-0": !expanded,
          })}
        >
          {tab.label}
        </div>
      </div>
    </Link>
  );
};

export default Sidebar;
