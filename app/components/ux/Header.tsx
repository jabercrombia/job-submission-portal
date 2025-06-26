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
    docs: "https://project-docs-amber.vercel.app/docs/job-submission-portal/listings",
  };

  const nav = {
    home: "/",
    dashboard: "/dashboard/listings",
    docs: "https://project-docs-amber.vercel.app/docs/job-submission-portal/listings",
  };

  return (
    <header>
      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b p-4 shadow-sm capitalize">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Job Portal</h1>
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-4 space-y-2">
            {dashboard == "dashboard" ? (
              <div className="mt-4 space-y-2">
                {Object.entries(dashboardnav).map(([label, path], index) => (
                  <div key={index}>
                    <Link
                      href={path}
                      target={label === "docs" ? "_blank" : undefined}
                      rel={label === "docs" ? "noopener noreferrer" : undefined}
                    >
                      {label}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {Object.entries(nav).map(([label, path], index) => (
                  <div key={index}>
                    <a
                      href={path}
                      target={label === "docs" ? "_blank" : undefined}
                      rel={label === "docs" ? "noopener noreferrer" : undefined}
                    >
                      {label}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
      {/* Desktop Navigation */}
      <div className="container mx-auto hidden md:block">
        {dashboard == "dashboard" ? (
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
      </div>
    </header>
  );
}

export default Header;
