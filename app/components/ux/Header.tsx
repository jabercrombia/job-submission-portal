"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const router = useRouter();

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

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

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
          <div className="mt-4 flex flex-col gap-3 pb-2">
            {Object.entries(dashboard === "dashboard" ? dashboardnav : nav).map(([label, path], index) => (
              <Link
                key={index}
                href={path}
                className="text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            ))}
            {dashboard === "dashboard" && (
              <button
                onClick={handleLogout}
                className="text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors text-left"
              >
                Sign out
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Desktop Navigation */}
      <div className="container mx-auto hidden md:flex items-center justify-between" style={{ padding: "0 24px" }}>
        <span className="text-white font-semibold tracking-widest text-sm uppercase">
          Job Portal
        </span>
        <div className="flex items-center gap-4">
          {dashboard === "dashboard" ? (
            <NavigationMenu>
              <NavigationMenuList>
                {Object.entries(dashboardnav).map(([label, path], index) => (
                  <NavigationMenuItem key={index}>
                    <a href={path}>{label}</a>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <NavigationMenu>
              <NavigationMenuList>
                {Object.entries(nav).map(([label, path], index) => (
                  <NavigationMenuItem key={index}>
                    <Link href={path}>{label}</Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {dashboard === "dashboard" && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs uppercase tracking-widest transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
