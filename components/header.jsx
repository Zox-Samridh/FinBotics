import React from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { checkUser } from '@/lib/checkUser';

const Header = async () => {
  await checkUser();

  return (
    <div className="fixed top-0 w-full z-50 shadow-xl">
      {/* Navbar with gradient, shadow, and curved bottom */}
      <div className="bg-gradient-to-r from-[#282828] to-[#282828]  border-gray-800 backdrop-blur-md">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src={"/l11.png"}
              alt="Welth Logo"
              width={200}
              height={60}
              className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-blue-500 flex items-center gap-2 transition-colors duration-300"
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-10 px-4 focus:outline-none focus:ring-0"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>
              <Link href="/transaction/create">
                <Button 
                  className="text-gray-300 hover:text-blue-500 flex items-center gap-2 transition-colors duration-300 h-10 px-4 focus:outline-none focus:ring-0"
                  variant="ghost" 
                  size="sm" 
              >
                  <PenBox size={18} />
                  <span className="hidden md:inline">Add Transaction</span>
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton forceRedirectUrl='/dashboard'>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 px-6 border-gray-300 hover:border-gray-400 shadow-sm focus:outline-none focus:ring-0"
                >
                  Log In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton  
                appearance={{
                  elements: { userButtonAvatarBox: "w-10 h-10 rounded-full shadow-md" }
                }}
              />
            </SignedIn>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-10 w-10 p-0 focus:outline-none focus:ring-0"
            >
              <Menu size={20} />
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
