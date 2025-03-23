"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "../layout/container";
import { cn } from "../../lib/utils";
import { tinaField } from "tinacms/dist/react";
import { Icon } from "../icon";
import NavItems from "./nav-items";
import { useLayout } from "../layout/layout-context";
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';

const headerColor = {
  default: "text-gray-900 from-white/80 to-white transition-colors duration-200",
  primary: {
    blue: "text-white from-blue-300 to-blue-500",
    teal: "text-white from-teal-400 to-teal-500",
    green: "text-white from-green-400 to-green-500",
    red: "text-white from-red-400 to-red-500",
    pink: "text-white from-pink-400 to-pink-500",
    purple: "text-white from-purple-400 to-purple-500",
    orange: "text-white from-orange-400 to-orange-500",
    yellow: "text-white from-yellow-400 to-yellow-500",
  },
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const layoutData = useLayout();
  const globalSettings = layoutData?.globalSettings || { header: undefined };
  const theme = layoutData?.theme || { color: "green" };
  const header = globalSettings.header || { 
    color: "default", 
    icon: { name: "", color: "", style: "" }, 
    name: "",
    nav: []
  };
  
  // Use the theme color from globalSettings if available
  const themeColor = globalSettings?.theme?.color || theme.color || "blue";
  
  const headerColorCss =
    header.color === "primary" && themeColor
      ? headerColor.primary[themeColor as keyof typeof headerColor.primary]
      : headerColor.default;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('[data-mobile-menu]')) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);
  
  // Close menu on escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [mobileMenuOpen]);

  return (
    <div
      className={cn(
        "sticky top-0 z-50 w-full",
        "overflow-hidden bg-gradient-to-b",
        headerColorCss,
        scrolled && "shadow-sm backdrop-blur-md bg-white/90"
      )}
    >
      <Container size="custom" className="py-0 relative z-10 max-w-8xl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo/Brand */}
          <h4 className="select-none text-lg font-bold tracking-tight transition duration-150 ease-out transform">
            <Link
              href="/"
              className={`flex gap-1 items-center whitespace-nowrap tracking-[.002em] hover:text-${themeColor}-600 transition-colors duration-200`}
            >
              {/* <Icon
                tinaField={header.icon ? tinaField(header, "icon") : ""}
                parentColor={header.color || ""}
                data={{
                  name: header.icon?.name || "",
                  color: header.icon?.color || "",
                  style: header.icon?.style || "",
                }}
              />{" "} */}
                    {/* Only render Image if logo exists */}
                    {(header as any).logo ? (
                      <Image
                      className='h-[100px] w-[200px] shadow-sm'
                      src={(header as any).logo}
                      alt={header.name || 'Logo'}
                      width={500}
                      height={500}
                    />
                    ) : null}
              {/* <span data-tina-field={tinaField(header, "name")}>
                {header.name}
              </span> */}
            </Link>
          </h4>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <NavItems navs={header.nav} />
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden" data-mobile-menu>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className={cn(
                "relative inline-flex items-center justify-center rounded-md p-2 text-gray-800",
                `hover:text-${themeColor}-500 hover:bg-${themeColor}-50`,
                `focus:outline-none focus:ring-2 focus:ring-inset focus:ring-${themeColor}-500 transition-all duration-200`
              )}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Bottom border */}
        <div
          className={cn(
            `absolute h-1 bg-gradient-to-r from-transparent`,
            `via-gray-300`,
            "to-transparent bottom-0 left-4 right-4 -z-1 opacity-5 transition-colors duration-200"
          )}
        />
      </Container>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ 
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="md:hidden overflow-hidden bg-white border-b border-gray-200 shadow-lg"
            data-mobile-menu
          >
            <div className="px-4 py-3 sm:px-6 bg-gradient-to-b from-white to-gray-50">
              <div className="flow-root">
                <div className="py-2">
                  {header.nav?.map((item: any) => (
                    <div key={item.href} className="group">
                      <Link
                        href={`/${item.href}`}
                        className={cn(
                          "flex items-center justify-between py-3 text-base font-medium text-gray-900",
                          `hover:text-${themeColor}-600 border-b border-gray-100 last:border-0`,
                          `focus:outline-none focus-visible:ring-2 focus-visible:ring-${themeColor}-500`
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{item.label}</span>
                        <svg
                          className={`ml-2 h-4 w-4 text-gray-400 group-hover:text-${themeColor}-500`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}