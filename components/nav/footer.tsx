"use client";
import React from "react";
import Image from 'next/image';
import Link from "next/link";
import { useLayout } from "../layout/layout-context";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
  FaWhatsapp,
  FaDiscord,
  FaTelegram,
  FaReddit,
  FaTiktok,
  FaPinterest,
} from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";

interface NavigationItem {
  label: string;
  href: string;
}

interface FooterProps {
  __typename: "GlobalFooter";
  color?: string | null;
  nav?: NavigationItem[];
  copyright?: string;
  social?: {
    __typename: "GlobalFooterSocial";
    facebook?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    linkedIn?: string | null;
    github?: string | null;
    youtube?: string | null;
    whatsapp?: string | null;
    discord?: string | null;
    telegram?: string | null;
    reddit?: string | null;
    tiktok?: string | null;
    pinterest?: string | null;
  };
}

export default function Footer() {
  const { theme, globalSettings } = useLayout();
  const footer = globalSettings?.footer as FooterProps;
  const navigation = footer?.nav || [];

  return (
    <footer className="w-ful my-5">
      <div className="mx-2 md:mx-5 px-4 md:px-10 pt-4 md:pt-12 bg-green-600 rounded-3xl text-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 md:pb-4 pb-10  w-full">
          {/* Logo Section */}
          <div className="col-span-2 lg:col-span-1 flex  items-center flex-col ">
            <Link href="/" className="flex justify-start bg-gray-100 rounded-3xl border-4 border-green-700 p-3">
              {(globalSettings?.header as any)?.logo ? (
                <Image
                  className="w-auto h-[100px]"
                  src={(globalSettings?.header as any).logo}
                  alt={globalSettings?.header?.logo || 'Logo'}
                  width={200}
                  height={100}
                  priority
                />
              ) : null}
            </Link>
            <div className="flex flex-col  items-center w-full">
              <p className="py-8 text-md text-white  text-center ">
             Our content is written and fact-checked by industry experts and is continually updated as the dynamics of the industry change.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-xl text-white font-medium mb-3">Quick Links</h4>
            <div className="h-[2px] w-12 bg-white/30 mx-auto mb-4"></div>
            <ul className="text-lg transition-all duration-500 ">
              {navigation.slice(0, 4).map((item: NavigationItem, i: number) => (
                <li key={i} className="mb-4 last:mb-0">
                  <Link 
                    href={`/${item.href}`} 
                    className="text-white/80 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Section */}
          <div className="text-center">
            <h4 className="text-xl text-white font-medium mb-3">Products</h4>
            <div className="h-[2px] w-12 bg-white/30 mx-auto mb-4"></div>
            <ul className="text-lg transition-all duration-500">
              <li className="mb-4">
                <Link href="/products" className="text-white/80 hover:text-white">
                  UI System
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/assets" className="text-white/80 hover:text-white">
                  Assets
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/blocks" className="text-white/80 hover:text-white">
                  Blocks
                </Link>
              </li>
              <li>
                <Link href="/components" className="text-white/80 hover:text-white">
                  Components
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="text-center">
            <h4 className="text-xl text-white font-medium mb-3">Resources</h4>
            <div className="h-[2px] w-12 bg-white/30 mx-auto mb-4"></div>
            <ul className="text-lg transition-all duration-500">
              <li className="mb-4">
                <Link href="/faq" className="text-white/80 hover:text-white">
                  FAQs
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/quickstart" className="text-white/80 hover:text-white">
                  Quick Start
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/docs" className="text-white/80 hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-white/80 hover:text-white">
                  User Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-7 border-t border-white/10">
          <div className="flex items-center justify-between flex-col lg:flex-row">
            <span className="text-sm text-white/80">
              {footer?.copyright || '© 2025 All rights reserved.'}
            </span>

            {/* Social Icons */}
            {footer?.social && (
              <div className="flex mt-4 space-x-4 sm:justify-center lg:mt-0">
                {footer.social.facebook && (
                  <a 
                    href={footer.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <FaFacebookF className="text-white w-4 h-4" />
                  </a>
                )}
                {footer.social.twitter && (
                  <a 
                    href={footer.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <FaXTwitter className="text-white w-4 h-4" />
                  </a>
                )}
                {footer.social.instagram && (
                  <a 
                    href={footer.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <AiFillInstagram className="text-white w-4 h-4" />
                  </a>
                )}
                {footer.social.linkedIn && (
                  <a 
                    href={footer.social.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <FaLinkedin className="text-white w-4 h-4" />
                  </a>
                )}
                {footer.social.youtube && (
                  <a 
                    href={footer.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <FaYoutube className="text-white w-4 h-4" />
                  </a>
                )}
                {footer.social.github && (
                  <a 
                    href={footer.social.github}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <FaGithub className="text-white w-4 h-4" />
                  </a>
                )}
                {footer.social.whatsapp && (
                  <a 
                    href={footer.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <FaWhatsapp className="text-white w-4 h-4" />
                  </a>
                )}
                {footer.social.discord && (
                  <a 
                    href={footer.social.discord}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <FaDiscord className="text-white w-4 h-4" />
                  </a>
                )}
                {footer.social.telegram && (
                  <a 
                    href={footer.social.telegram}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <FaTelegram className="text-white w-4 h-4" />
                  </a>
                )}
                {footer.social.reddit && (
                  <a 
                    href={footer.social.reddit}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <FaReddit className="text-white w-4 h-4" />
                  </a>
                )}
                {footer.social.tiktok && (
                  <a 
                    href={footer.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <FaTiktok className="text-white w-4 h-4" />
                  </a>
                )}
                {footer.social.pinterest && (
                  <a 
                    href={footer.social.pinterest}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 transition-colors"
                  >
                    <FaPinterest className="text-white w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}