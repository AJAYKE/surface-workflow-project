"use client";

import {
  BeakerIcon,
  ChartBarIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  HomeIcon,
  PuzzlePieceIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const sidebarStyles = {
  aside:
    "relative flex h-screen w-64 shrink-0 flex-col bg-white shadow-lg border-r border-neutral-200",

  section: "px-6 py-5",
  divider: "border-t border-neutral-200",

  brand: "text-2xl font-sora font-bold",
  brandPrimary: "text-neutral-900",
  brandSecondary: "text-white bg-primary-600 px-2 py-1 rounded",

  workspaceRow:
    "flex items-center justify-between rounded-lg px-3 py-2.5 text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer",
  workspaceText: "text-sm font-medium",
  chevron: "h-4 w-4 text-neutral-400",

  gettingStartedBtn:
    "flex items-center rounded-lg px-3 py-2.5 font-medium bg-neutral-500 text-white hover:bg-neutral-900 transition-colors",
  gettingStartedIcon: "h-5 w-5 mr-3",

  navList: "space-y-1",
  navItemBase:
    "flex items-center rounded-lg px-3 py-2.5 font-medium transition-colors text-sm",
  navItemActive: "bg-neutral-100 text-neutral-700",
  navItemInactive: "text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700",
  navIcon: "h-5 w-5 mr-3 shrink-0",

  footer:
    "px-6 py-4 flex items-center gap-3 border-t border-neutral-200 mt-auto",
  avatar:
    "w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-semibold text-white shrink-0",
  userName: "text-sm font-semibold text-neutral-900",
  userEmail: "text-xs text-neutral-500",
};

type NavItem = { label: string; href: string; icon: React.ElementType };
const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "#", icon: Squares2X2Icon },
  { label: "Funnels", href: "#", icon: ChartBarIcon },
  { label: "Leads", href: "#", icon: UserGroupIcon },
  { label: "Segments", href: "#", icon: BeakerIcon },
  { label: "Workflows", href: "#", icon: PuzzlePieceIcon },
  { label: "Integrations", href: "#", icon: PuzzlePieceIcon },
  { label: "Settings", href: "#", icon: Cog6ToothIcon },
];

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("Getting started");

  return (
    <aside className={sidebarStyles.aside}>
      <div className={sidebarStyles.section}>
        <h1 className={sidebarStyles.brand}>
          <span className={sidebarStyles.brandPrimary}>surface</span>{" "}
          <span className={sidebarStyles.brandSecondary}>labs</span>
        </h1>
      </div>

      <div className={sidebarStyles.divider} />

      <div className={sidebarStyles.section}>
        <div className={sidebarStyles.workspaceRow}>
          <span className={sidebarStyles.workspaceText}>My workspace</span>
          <ChevronDownIcon className={sidebarStyles.chevron} />
        </div>
      </div>

      <div className={sidebarStyles.divider} />

      <div className={sidebarStyles.section}>
        <button
          onClick={() => setActiveItem("Getting started")}
          className={sidebarStyles.gettingStartedBtn}
        >
          <HomeIcon className={sidebarStyles.gettingStartedIcon} />
          Getting started
        </button>
      </div>

      <div className={sidebarStyles.divider} />

      <div className={sidebarStyles.section}>
        <nav className={sidebarStyles.navList}>
          <ul>
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <button
                  onClick={() => setActiveItem(label)}
                  className={`${sidebarStyles.navItemBase} w-full text-left ${activeItem === label
                    ? sidebarStyles.navItemActive
                    : sidebarStyles.navItemInactive
                    }`}
                >
                  <Icon className={sidebarStyles.navIcon} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={sidebarStyles.footer}>
        <div className={sidebarStyles.avatar}>CH</div>
        <div className="min-w-0">
          <p className={sidebarStyles.userName}>Chris Hood</p>
          <p className={sidebarStyles.userEmail}>hello@example.com</p>
        </div>
      </div>
    </aside>
  );
}