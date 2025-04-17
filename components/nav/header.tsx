"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "../layout/container";
import { cn } from "../../lib/utils";
import { tinaField } from "tinacms/dist/react";
import { Icon } from "../icon";
import NavItems from "./nav-items";
import { useLayout } from "../layout/layout-context";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Image from 'next/image';
import { usePathname } from "next/navigation";
import { GiAce, GiDiceSixFacesSix, GiSpades } from "react-icons/gi";
import { FaHome, FaUserCircle, FaBlog } from "react-icons/fa";
import { IoStorefront, IoGiftOutline, IoMailOutline } from "react-icons/io5";
import { MdOutlineArticle } from "react-icons/md";
import { LuNewspaper } from "react-icons/lu";
import { RiArrowRightSLine } from "react-icons/ri";

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

// Animation variants for mobile menu and menu items
const menuVariants: Variants = {
  hidden: { 
    opacity: 0, 
    height: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      staggerDirection: 1,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const menuItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const currentPath = usePathname() || "";
  const [isClient, setIsClient] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    setIsClient(true);
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
        "overflow-hidden bg-gradient-to-b border-b-[1px] border-grey-400",
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
              {/* Only render Image if logo exists */}
              {(header as any).logo ? (
                <Image
                  className='h-[100px] w-auto p-6'
                  src={(header as any).logo}
                  alt={header.name || 'Logo'}
                  width={200}
                  height={100}
                  priority
                />
              ) : null}
            </Link>
          </h4>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <NavItems navs={header.nav} />
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden outline-none" data-mobile-menu>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className={cn(
                "relative inline-flex items-center justify-center p-3 rounded-full outline-none focus:outline-none border-none focus:ring-0",
                mobileMenuOpen 
                  ? `text-white bg-${themeColor}-500 shadow-md border-none focus:ring-0 outline-none`
                  : "text-gray-700 bg-white",
                `hover:bg-${themeColor}-500 hover:text-white outline-none`,
                `focus:outline-none focus:ring-0 focus:ring-${themeColor}-500 transition-all duration-200 outline-none`
              )}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="2" 
                stroke="currentColor"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{
                    open: { d: "M6 18L18 6M6 6l12 12", transition: { duration: 0.2 } },
                    closed: { d: "M4 6h16M4 12h16M4 18h16", transition: { duration: 0.2 } }
                  }}
                  initial="closed"
                  animate={mobileMenuOpen ? "open" : "closed"}
                />
              </svg>
            </button>
          </div>
        </div>
      </Container>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && isClient && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden overflow-hidden border-b border-gray-200 shadow-lg"
            data-mobile-menu
          >
            <div className={cn(
              "px-4 py-2 sm:px-6", 
              `bg-gradient-to-tr from-${themeColor}-50/50 to-white`
            )}>
              <div className="flow-root">
                <div className="py-2 space-y-1">
                  {header.nav?.map((item: any, index: number) => {
                    // Check if current path matches item.href exactly or starts with item.href/ for subfolders
                    const itemPath = `/${item.href}`;
                    
                    // Special case for home - active when URL is either "/" or "/home"
                    const isHomePage = item.href === 'home' && (currentPath === '/' || currentPath === '/home');
                    
                    const isActive = 
                      isHomePage || 
                      currentPath === itemPath || 
                      (currentPath.startsWith(itemPath + '/') && itemPath !== '/');
                      
                    return (
                      <motion.div 
                        key={item.href} 
                        variants={menuItemVariants}
                        className="group"
                      >
                        <Link
                          href={`/${item.href}`}
                          className={cn(
                            "flex items-center px-3 py-3.5 rounded-xl text-base font-medium outline-none focus:outline-none border-none focus:ring-0",
                            "transition-all duration-300 ease-out",
                            isActive
                              ? `bg-${themeColor}-100 text-${themeColor}-800 font-semibold`
                              : `text-gray-700 hover:text-${themeColor}-600 hover:bg-${themeColor}-50`,
                            `focus:outline-none focus-visible:ring-0 focus-visible:ring-${themeColor}-500`
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {/* Casino-themed icons for navigation */}
                          <div className={cn(
                            "flex items-center justify-center w-9 h-9 mr-3 rounded-lg shadow-sm",
                            isActive
                              ? `bg-${themeColor}-500 text-white`
                              : `bg-${themeColor}-50/50 text-${themeColor}-600`
                          )}>
                            <motion.div
                              animate={{ 
                                scale: isActive ? [1, 1.1, 1] : 1,
                                rotate: isActive ? [0, 5, -5, 0] : 0,
                                transition: {
                                  duration: 2,
                                  repeat: isActive ? Infinity : 0,
                                  repeatDelay: 1
                                }
                              }}
                              className="w-5 h-5"
                            >
                              {/* Home - Home icon */}
                              {item.href.includes('home') && <FaHome size={20} />}
                              
                              
                              {/* casino - Spades card icon */}
                              {item.href.includes('casino') && <GiSpades size={20} />}
                              
                              {/* sweepstakes - blog icon */}
                              {item.href.includes('sweepstakes') && <GiAce size={20} />}
                              
                              
                              {/* posts - article icon */}
                              {item.href.includes('posts') && <LuNewspaper  size={20} />}
                              
                              {/* bonuses - gift icon */}
                              {item.href.includes('bonuses') && <IoGiftOutline size={20} />}

                              {/* contact - mail icon */}
                              {item.href.includes('contact') && <IoMailOutline size={20} />}
                            </motion.div>
                          </div>
                          <span className="flex-1">{item.label}</span>
                          <motion.div 
                            className={cn(
                              "w-5 h-5",
                              isActive
                                ? `text-${themeColor}-600`
                                : `text-gray-400 group-hover:text-${themeColor}-500`
                            )}
                            animate={{ 
                              x: isActive ? [0, 3, 0] : 0,
                              opacity: isActive ? 1 : 0.5,
                              transition: { 
                                duration: 0.4,
                                repeat: isActive ? Infinity : 0,
                                repeatType: "reverse",
                                repeatDelay: 1.5
                              }
                            }}
                          >
                            <RiArrowRightSLine size={20} />
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}