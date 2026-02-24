import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Dashboard",      path: "/"  },
  { label: "Email Verifier", path: "/emailVerifier"},
  { label: "Email Finder",   path: "/emailFinder"},
  { label: "Prospect",       path: "/prospect"},
  { label: "Form Guard",     path: "/formGuard" },
  { label: "Reverse Lookup", path: "/reverseLookup" },
  { label: "Developer",      path: "/developer"},
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="sticky top-0 z-50 w-full font-sans">

      {/* ── Top Bar ── */}
      <div className="w-full bg-gradient-to-r from-[#2e2c1e] via-[#4a4830] to-[#7a7550] px-5 py-2 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center shadow">
            <span className="text-white text-sm font-extrabold">C</span>
          </div>
          <span className="text-white font-extrabold text-lg tracking-tight leading-none">
            clear<span className="text-orange-400">out</span>
          </span>
        </div>

        {/* Announcement Banner */}
        {showBanner && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-[#3a3820] border border-[#6b6840] rounded-full px-4 py-1 text-sm">
              <span className="text-gray-200">
                <span className="font-bold text-white">Auto Credit Replenishment</span>
                {" "}is live! Set automated credit top-ups easily.{" "}
                <button className="text-orange-400 font-semibold hover:underline">
                  Learn More →
                </button>
              </span>
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-white ml-1 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Right Icons */}
        <div className="flex items-center gap-4 shrink-0">
          <button className="text-gray-300 hover:text-white transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="text-gray-300 hover:text-white relative transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
              1
            </span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shadow">
              K
            </div>
            <span className="text-white text-sm font-medium group-hover:text-orange-300 transition-colors">
              Kavya
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

      </div>

      {/* ── Bottom Nav Bar ── */}
      <div className="w-full bg-white border-b border-gray-200 px-4 flex items-center justify-between">

        {/* Nav Links */}
        <NavigationMenu className="max-w-none">
          <NavigationMenuList className="gap-0 flex">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.path);

              return (
                <NavigationMenuItem key={link.path} className="relative">
                  <NavigationMenuLink
                    onClick={() => navigate(link.path)}
                    className={cn(
                      "relative cursor-pointer flex items-center gap-1.5 px-3 py-4 text-sm font-medium transition-colors select-none",
                      "bg-transparent hover:bg-transparent focus:bg-transparent",
                      "hover:text-orange-500",
                      isActive
                        ? "text-orange-500"
                        : "text-gray-700"
                    )}
                  >
                    {/* Active underline */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-orange-500 rounded-t-full" />
                    )}

                    <span className="text-xs opacity-70">{link.icon}</span>
                    {link.label}

                    {/* New badge */}
                    {link.badge && (
                      <span className="absolute -top-0 right-0 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                        {link.badge}
                      </span>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}

            {/* More */}
            <NavigationMenuItem>
              <NavigationMenuLink className="cursor-pointer flex items-center gap-1 px-3 py-4 text-sm font-medium text-gray-700 hover:text-orange-500 bg-transparent hover:bg-transparent focus:bg-transparent">
                <span className="text-xs opacity-70">⋮</span>
                More
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Buttons */}
        <div className="flex items-center gap-2 shrink-0 pl-4">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center gap-1.5 rounded-md"
          >
            Review us on
            <span className="font-extrabold text-orange-500 text-sm">G</span>
          </Button>
          <Button
            size="sm"
            className="h-8 px-4 text-xs bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md shadow"
          >
            Buy Credits
          </Button>
        </div>

      </div>
    </div>
  );
}