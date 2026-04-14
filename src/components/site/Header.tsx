"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <nav className="bg-white backdrop-blur-lg border-b border-border py-4">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" onClick={handleLinkClick}>
          <img
            src="/Blood-Bond-Logo.png"
            width="250"
            alt="Blood Bond"
            className="max-w-[180px] md:max-w-[250px]"
          />
        </Link>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/donors">
            <Button variant="outline">Donors</Button>
          </Link>
          <Link href="/search">
            <Button>Guest Order</Button>
          </Link>
        </div>

        {/* MOBILE HAMBURGER BUTTON (Sheet) */}
        <div className="md:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex flex-col p-4 gap-3 mt-16">
                <Link href="/auth" onClick={handleLinkClick}>
                  <Button variant="ghost" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link href="/donors" onClick={handleLinkClick}>
                  <Button variant="outline" className="w-full justify-start">
                    Donors
                  </Button>
                </Link>
                <Link href="/search" onClick={handleLinkClick}>
                  <Button className="w-full justify-start">Guest Order</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}