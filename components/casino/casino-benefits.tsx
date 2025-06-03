import React, { useState } from 'react'
import { MdOutlineLanguage } from "react-icons/md"
import { CasinoItemQueryQuery } from "@/tina/__generated__/types"
import MermaidElement from '../mermaid-renderer'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { MorphingPopover } from "@/components/ui/morphing-popover"
import { ImBlocked } from "react-icons/im";
import { FaMobileAlt, FaStoreAlt, FaStoreAltSlash } from "react-icons/fa";
import { FcAndroidOs } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io";
import { IoGift } from "react-icons/io5";
// Additional icon imports for bonus types
import { FaHandshake, FaSync, FaStar, FaDollarSign, FaSpinner, FaTicketAlt, FaUserTie } from "react-icons/fa";
import { GiTwoCoins, GiReceiveMoney, GiCash } from "react-icons/gi";
// Additional icons for the updated design
import { HiGift, HiCurrencyDollar, HiRefresh } from "react-icons/hi";
import { BsCoin, BsStars, BsArrowRepeat, BsTrophy } from "react-icons/bs";
import { RiVipCrownFill, RiCoupon3Fill } from "react-icons/ri";

interface BenefitItem {
  icon: React.ReactNode
  title: string
  description: string
}

interface CasinoBenefitsProps {
  casino: CasinoItemQueryQuery["casino"]
}

export function CasinoBenefits({ casino }: CasinoBenefitsProps) {
  const [showLanguagePopover, setShowLanguagePopover] = useState(false)
  const [showRestrictedCountriesPopover, setShowRestrictedCountriesPopover] = useState(false)
  const [showBonusesPopover, setShowBonusesPopover] = useState(false)

  // Add a style tag for our animation
  React.useEffect(() => {
    // Create style element if it doesn't exist
    if (!document.getElementById('bonus-animations')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'bonus-animations';
      styleEl.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    // Clean up on unmount
    return () => {
      const styleEl = document.getElementById('bonus-animations');
      if (styleEl) styleEl.remove();
    };
  }, []);

  // Function to extract bonus type from __typename
  const extractBonusType = (typename?: string): string => {
    if (!typename) return '';
    
    // Check if the typename follows the pattern CasinoBonuses{Type}_bonus
    const match = typename.match(/CasinoBonuses([A-Za-z]+)_bonus/);
    if (match && match[1]) {
      // Convert camelCase to normal text with spaces (e.g., WelcomeBonus -> Welcome Bonus)
      return match[1].replace(/([A-Z])/g, ' $1').trim();
    }
    return '';
  };

  // Function to get the appropriate icon for a bonus type
  const getBonusIcon = (bonusType: string) => {
    switch (bonusType.toLowerCase()) {
      case 'welcome':
        return <HiGift className="text-green-500 text-2xl" />;
      case 'matchdeposit':
        return <BsCoin className="text-green-500 text-2xl" />;
      case 'reload':
        return <HiRefresh className="text-green-500 text-2xl" />;
      case 'regular':
        return <HiCurrencyDollar className="text-green-500 text-2xl" />;
      case 'freespins':
        return <BsStars className="text-green-500 text-2xl" />;
      case 'cashback':
        return <BsArrowRepeat className="text-green-500 text-2xl" />;
      case 'vip':
        return <RiVipCrownFill className="text-green-500 text-2xl" />;
      default:
        return <RiCoupon3Fill className="text-green-500 text-2xl" />;
    }
  };

  // Replace the color class function with a grey color scheme
  const getBonusColorClass = () => {
    return 'bg-green-500 text-white dark:bg-gray-800 border-2 border-white dark:border-gray-600';
  };

  return (
    <div className="mb-14 w-full">
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-gray-100 tracking-tight">
       {casino.title} Review
      </h2>
      <div className="text-center text-gray-400 dark:text-gray-200 mb-8">
      <TinaMarkdown 
        content={casino.excerpt}
        components={{
          mermaid({ value }: { value: string }) {
            return <MermaidElement value={value} />;
          }
        }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div 
            id="website"
            className="p-4 bg-transparent dark:bg-gray-900 rounded-lg shadow-sm border border-white dark:border-gray-800 transition-all hover:shadow-md cursor-pointer"
            onClick={() => setShowLanguagePopover(!showLanguagePopover)}
          >
            <MdOutlineLanguage className="text-left w-10 h-10 mx-left mb-2 text-gray-500 dark:text-gray-200" />
            <span className="text-md font-semibold text-center mb-2 mt-0 text-gray-800 dark:text-gray-200">
              Website
            </span>
            <div className="flex flex-col items-center my-4">

            

            <MorphingPopover
              trigger={
                <div className="w-full text-center text-lg text-purple-600 dark:text-gray-400">
                  {casino.language && casino.language.length > 0 ? `${casino.language?.[0]?.count} languages` : 'Multiple languages'}
                </div>
              }
              content={
                <div className="p-3 bg-white dark:bg-gray-800">
                  <div className="flex flex-wrap gap-2 items-center">
                    {casino.language && casino.language[0]?.all_language ? (
                      Array.isArray(casino.language[0].all_language) ? 
                        casino.language[0].all_language.map((lang: string, index: number) => (
                          <p 
                            key={index} 
                            className="text-sm text-center text-gray-700 dark:text-gray-300"
                          >
                            {lang}
                            {Array.isArray(casino.language?.[0]?.all_language) && 
                             index < (casino.language?.[0]?.all_language?.length ?? 0) - 1 ? ', ' : ''}
                          </p>
                        ))
                        :
                        <p className="text-xs text-center text-gray-700 dark:text-gray-300">
                          {String(casino.language[0].all_language)}
                        </p>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">No language</span>
                    )}
                  </div>
                </div>
              }
              showPopover={showLanguagePopover}
              setShowPopover={setShowLanguagePopover}
              position="bottom"
              className="w-72"
              bgColor="bg-white dark:bg-gray-800"
            />
            </div>
          </div>

          <div 
            id="restricted-countries"
            className="p-4 bg-transparent dark:bg-gray-900 rounded-lg shadow-sm border border-white dark:border-gray-800 transition-all hover:shadow-md cursor-pointer"
            onClick={() => setShowRestrictedCountriesPopover(!showRestrictedCountriesPopover)}
          >
            <ImBlocked className="text-left w-10 h-10 mx-left mb-2 text-red-300 dark:text-gray-200" />
            <span className="text-md font-semibold text-center mb-2 mt-0 text-gray-800 dark:text-gray-200">
            Restricted countries
            </span>
            <div className="flex flex-col items-center my-4">

            <MorphingPopover
              trigger={
                <div className="w-full text-center text-lg text-purple-600 dark:text-gray-400">
                  {casino.restricted_countries && casino.restricted_countries.length > 0 ? `${casino.restricted_countries?.[0]?.count} countries` : 'No countries'}
                </div>
              }
              content={
                <div className="p-3 bg-white dark:bg-gray-800">
                  <div className="flex flex-wrap gap-2 items-center">
                    {casino.restricted_countries && casino.restricted_countries[0]?.all_restricted_countries ? (
                      Array.isArray(casino.restricted_countries[0].all_restricted_countries) ? 
                        casino.restricted_countries[0].all_restricted_countries.map((lang: string, index: number) => (
                          <p 
                            key={index} 
                            className="text-sm text-center text-gray-700 dark:text-gray-300"
                          >
                            {lang}
                            {Array.isArray(casino.restricted_countries?.[0]?.all_restricted_countries) && 
                             index < (casino.restricted_countries?.[0]?.all_restricted_countries?.length ?? 0) - 1 ? ', ' : ''}
                          </p>
                        ))
                        :
                        <p className="text-xs text-center text-gray-700 dark:text-gray-300">
                          {String(casino.restricted_countries[0].all_restricted_countries)}
                        </p>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">N/A</span>
                    )}
                  </div>
                </div>
              }
              showPopover={showRestrictedCountriesPopover}
              setShowPopover={setShowRestrictedCountriesPopover}
              position="bottom"
              className="w-72"
              bgColor="bg-white dark:bg-gray-800"
            />
            </div>
          </div>


          <div 
            id="mobile-app"
            className="p-4 bg-transparent dark:bg-gray-900 rounded-lg shadow-sm border border-white dark:border-gray-800 transition-all hover:shadow-md relative"
          >
            <span className="text-xs  text-gray-400 dark:text-gray-200 absolute  top-0 right-0 mr-2 mt-1">
                  {casino?.mobile_app?.[0]?.marketplace ? 
                  "On marketplace"
                  : ""}
            </span>
            <FaMobileAlt className="text-left w-10 h-10 mx-left mb-2 text-gray-500 dark:text-gray-200" />
            <span className="text-md font-semibold text-center mb-2 mt-0 text-gray-800 dark:text-gray-200">
              Mobile App 
            </span>
            <div className="flex flex-row items-center justify-center gap-4 mt-2">
         
            {(casino?.mobile_app?.[0]?.android_app?.length ?? 0) > 0 ? 
            <a href={casino?.mobile_app?.[0]?.android_app ?? '#'} className="bg-transparent border-none inline-block">
              <FcAndroidOs className="text-left w-12 h-12 mx-left  text-gray-500 dark:text-gray-200 border-2 border-white dark:border-gray-800 rounded-full p-1" />
            </a>
              : ''}

            {(casino?.mobile_app?.[0]?.ios_app?.length ?? 0) > 0 ? 
            <a href={casino?.mobile_app?.[0]?.ios_app ?? '#'} className="bg-transparent border-none inline-block">
              <IoLogoApple className="text-left w-12 h-12 mx-left  text-gray-700 dark:text-gray-800 border-2 border-white dark:border-gray-800 rounded-full p-1" />
            </a>
            : ''}
            </div>
          </div>


          <div 
            id="bonuses"
            className="p-4 bg-transparent dark:bg-gray-900 rounded-lg shadow-sm border border-white dark:border-gray-800 transition-all hover:shadow-md cursor-pointer"
            onClick={() => setShowBonusesPopover(!showBonusesPopover)}
          >
            <IoGift className="text-left w-10 h-10 mx-left mb-2 text-green-500 dark:text-gray-200" />
            <span className="text-md font-semibold text-center mb-2 mt-0 text-gray-800 dark:text-gray-200">
            Bonuses
            </span>
            <div className="flex flex-col md:items-center items-end my-4">

            <MorphingPopover
              trigger={
                <div className="w-full text-center text-lg text-purple-600 dark:text-gray-400">
                  {casino.bonuses && casino.bonuses.length > 0 ? `${casino.bonuses.length} bonuses` : 'No bonuses'}
                </div>
              }
              content={
                <div className="p-3 bg-white dark:bg-gray-800">
                  <div className="flex flex-col gap-3">
                    {casino.bonuses && casino.bonuses.length > 0 ? (
                      casino.bonuses.map((bonus, index) => {
                        const bonusType = extractBonusType(bonus?.__typename);
                        return (
                          <div 
                            key={index} 
                            className={`flex items-center py-3 px-4 rounded-lg ${getBonusColorClass()} 
                            shadow-sm transition-all hover:shadow-md hover:scale-105`}
                            style={{
                              opacity: 0,
                              animation: 'fadeIn 0.6s ease-out forwards',
                              animationDelay: `${index * 100}ms`
                            }}
                          >
                            <div className="mr-4 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-inne">
                              {getBonusIcon(bonusType)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-white text-md">
                                {bonusType} Bonus
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">No bonuses available</span>
                    )}
                  </div>
                </div>
              }
              showPopover={showBonusesPopover}
              setShowPopover={setShowBonusesPopover}
              position="left"
              className="w-72"
              bgColor="bg-white dark:bg-gray-800"
            />
            </div>
          </div>

      </div>

    </div>
  )
} 