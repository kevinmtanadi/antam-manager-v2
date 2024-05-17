"use client";

import React, { useEffect, useState } from "react";
import classname from "classnames";
import { IconType } from "react-icons";
import Link from "next/link";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import { TbShoppingBag } from "react-icons/tb";
import { LuHome, LuLayoutGrid, LuScrollText } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/react";
import { SunIcon } from "@/icons/SunIcon";
import { MoonIcon } from "@/icons/MoonIcon";

interface Tab {
  label: string;
  icon: IconType;
  target: string;
}

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const currentPath = usePathname();

  const overviewTabs: Tab[] = [
    {
      label: "Dashboard",
      icon: LuHome,
      target: "/",
    },
    {
      label: "Produk",
      icon: LuLayoutGrid,
      target: "/products",
    },
    {
      label: "Stok",
      icon: TbShoppingBag,
      target: "/stocks",
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
  ];

  return (
    <div
      className={classname({
        "bg-default-50 fixed top-0 min-w-[65px] h-screen transition-all border-r border-default-300 overflow-hidden z-50":
          true,
      })}
    >
      <div className="flex mb-4 border-b border-default-300 py-4 px-3 items-center">
        <button
          className="min-w-[40px] min-h-[40px] w-10 h-10 flex justify-center border-2 border-amber-500 rounded-lg"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <Image src={Logo} alt="Logo" width={24} height={24} />
        </button>
        <span
          className={classname({
            "overflow-hidden whitespace-nowrap transition-all font-semibold text-default-900":
              true,
            "w-52 ml-3": expanded,
            "w-0": !expanded,
          })}
        >
          Antam Manager
        </span>
        {expanded && (
          <button onClick={() => setExpanded(false)}>
            <GoChevronLeft className="p-1 text-default-900" size={"1.75rem"} />
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
        <div className="border-b border-default-300 px-3">
          {overviewTabs.map((tab) => (
            <SidebarItem
              key={tab.target}
              tab={tab}
              active={currentPath === tab.target}
              expanded={expanded}
            />
          ))}
        </div>
        <div className="mt-4 transition-all whitespace-nowrap">
          <div className="">
            <ThemeSwitcher expanded={expanded} />
          </div>
          <div
            className={classname({
              "flex my-2 rounded-md p-2.5 hover:text-blue-500 hover:bg-blue-200 transition-colors":
                true,
            })}
          ></div>
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
  const { theme } = useTheme();

  return (
    <Link key={tab.label} href={tab.target}>
      <div
        className={classname({
          "flex my-2 rounded-md p-2.5 hover:bg-default-200 transition-colors":
            true,
          "bg-blue-500 text-default-50": active,
          "text-default-900": !active,
        })}
      >
        <div>
          <tab.icon
            className={classname({
              "transition-colors": true,
            })}
            size={"1.2rem"}
          />
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

interface Props {
  expanded: boolean;
}
function ThemeSwitcher({ expanded }: Props) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleDarkMode = (isSelected: boolean) => {
    if (!isSelected) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className="flex gap-2">
      <Switch
        className="mr-0 ml-[10px] max-w-[40px]"
        endContent={undefined}
        size="sm"
        color="primary"
        isSelected={theme === "dark"}
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <SunIcon className={className} />
          ) : (
            <MoonIcon className={className} />
          )
        }
        onValueChange={toggleDarkMode}
      />
      <div
        className={classname({
          "transition-all h-5 overflow-hidden whitespace-nowrap text-sm text-default-900":
            true,
          "ml-3": expanded,
          "w-0": !expanded,
        })}
      >
        Dark Mode
      </div>
    </div>
  );
}
