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
        <div className="flex flex-col lg:flex-row justify-between gap-8 pt-10 md:pb-4 pb-10 w-full">
          {/* Logo Section */}
          <div className="flex items-center flex-col lg:w-1/3">
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


            <div className="flex flex-col items-center w-full">
              <p className="py-6 text-md text-white text-center">
                Our content is written and fact-checked by industry experts and is continually updated as the dynamics of the industry change.
              </p>
            </div>

            <button
                 data-tally-open="mOkb1a" data-tally-emoji-text="👋" data-tally-emoji-animation="wave"
                  className='group inline-flex items-center gap-2 bg-white hover:bg-green-700 text-green-500 hover:text-white px-6 py-3 my-3 rounded-full border-2 hover:border-white text-md md:text-lg font-bold transition-all duration-100 hover:shadow-md'
                >
                  <span>Sign Up For Newsletter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
            </button>
     
          </div>

          {/* Spacer for desktop */}
          <div className="hidden lg:block lg:w-1/12"></div>

          {/* Links Sections Container */}
          <div className="flex flex-col sm:flex-row justify-end gap-8 lg:w-1/2">
            {/* Quick Links*/}
            <div className="text-center sm:w-1/2">
              <h2 className="text-xl text-white font-medium mb-3">Menu</h2>
              <div className="h-[2px] w-12 bg-white/30 mx-auto mb-4"></div>
              <ul className="text-lg transition-all duration-500 ">
                {navigation.slice(0, 8).map((item: NavigationItem, i: number) => (
                  <li key={i} className="mb-3 last:mb-0">
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

            {/* Resources Section */}
            <div className="text-center sm:w-1/2">
              <h2 className="text-xl text-white font-medium mb-3">About us</h2>
              <div className="h-[2px] w-12 bg-white/30 mx-auto mb-4"></div>
              <ul className="text-lg transition-all duration-500">
              <li className="mb-3">
                <Link href="/contact" className="text-white/80 hover:text-white">
                Contact
                  </Link>
                </li>
                <li className="mb-3">
                <Link href="/about" className="text-white/80 hover:text-white">
                  About
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="/cookie-policy" className="text-white/80 hover:text-white">
                  Cookie policy
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="/responsible-gambling-guidelines" className="text-white/80 hover:text-white">
                  Gambling Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-use" className="text-white/80 hover:text-white">
                  Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
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