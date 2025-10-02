"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement?.classList.add("scrolled");
      } else {
        imageElement?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative pt-40 pb-20 px-4 overflow-hidden">
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, #282828 0%, #282828 100%)" }}
      />
      <div className="container mx-auto text-center relative z-10">
        <h1 
          className="text-5xl md:text-7xl lg:text-[100px] pb-6 gradient-title bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
        >
          Optimize Your Finances <br /> with Intelligence
        </h1>
        <p 
          className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>
        <div className="flex justify-center space-x-4 mb-12">
          <Link href="/dashboard">
            <Button size="lg" className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="mt-5 md:mt-0">
          <div ref={imageRef} className="relative group">
            <Image
              src="/banner3.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-2xl shadow-2xl border border-gray-200/50 mx-auto transition-all duration-500 group-hover:shadow-3xl group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
