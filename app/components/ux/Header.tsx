"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const dashboard = parts[0];

  const dashboardnav = {
    home: "/",
    applications: "/dashboard/applications",
    listings: "/dashboard/listings",
    "new posting": "/dashboard/create-entry",
  };

  const nav = {
    home: "/",
    dashboard: "/dashboard/listings",
  };

  const activeNav = dashboard === "dashboard" ? dashboardnav : nav;

  return (
    <header>
      {/* Mobile Navigation */}
      <nav className="md:hidden p-4">
        <div className="flex justify-between items-center">
          <span className="text-white font-semibold tracking-widest text-sm uppercase">
            Job Portal
          </span>
          <button onClick={toggleMenu} aria-label="Toggle menu" className="text-white opacity-80 hover:opacity-100">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {isOpen && (
<<<<<<< HEAD
          <div className="mt-4 flex flex-col gap-3 pb-2">
            {Object.entries(dashboard === "dashboard" ? dashboardnav : nav).map(([label, path], index) => (
              <Link
                key={index}
                href={path}
                target={label === "docs" ? "_blank" : undefined}
                rel={label === "docs" ? "noopener noreferrer" : undefined}
                className="text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
=======
          <div className="mt-4 space-y-2">
            {Object.entries(activeNav).map(([label, path], index) => (
              <div key={index}>
                <Link href={path} onClick={() => setIsOpen(false)}>
                  {label}
                </Link>
              </div>
>>>>>>> 44f9967 (main)
            ))}
          </div>
        )}
      </nav>

      {/* Desktop Navigation */}
<<<<<<< HEAD
      <div className="container mx-auto hidden md:flex items-center justify-between" style={{ padding: "0 24px" }}>
        <span className="text-white font-semibold tracking-widest text-sm uppercase">
          Job Portal
        </span>
        {dashboard === "dashboard" ? (
          <NavigationMenu>
            <NavigationMenuList>
              {Object.entries(dashboardnav).map(([label, path], index) => (
                <NavigationMenuItem key={index}>
                  <a
                    href={path}
                    target={label === "docs" ? "_blank" : undefined}
                    rel={label === "docs" ? "noopener noreferrer" : undefined}
                  >
                    {label}
                  </a>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <NavigationMenu>
            <NavigationMenuList>
              {Object.entries(nav).map(([label, path], index) => (
                <NavigationMenuItem key={index}>
                  <Link
                    href={path}
                    target={label === "docs" ? "_blank" : undefined}
                    rel={label === "docs" ? "noopener noreferrer" : undefined}
                  >
                    {label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        )}
=======
      <div className="container mx-auto hidden md:block">
        <NavigationMenu>
          <NavigationMenuList>
            {Object.entries(activeNav).map(([label, path], index) => (
              <NavigationMenuItem key={index}>
                <Link href={path}>{label}</Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
>>>>>>> 44f9967 (main)
      </div>
    </header>
  );
}

export default Header;
