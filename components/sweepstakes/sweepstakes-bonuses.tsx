import React, { useState } from 'react';
import Link from 'next/link';
import { FaGift } from "react-icons/fa";
import { FaClipboard, FaClipboardCheck } from "react-icons/fa";
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import MermaidElement from '../mermaid-renderer';

// Define a local interface that matches the structure we need
interface Bonus {
  __typename?: string;
  bonus_title?: string | null;
  bonus_code?: string | null;
  bonus_description?: string | null;
  bonus_link?: string | null;
  bonus_type?: string; // Added to handle UI display of bonus type
}

interface SweepstakesBonusesProps {
  bonuses?: any[] | null; // Use any to accept the TinaCMS generated types
}

export function SweepstakesBonuses({ bonuses }: SweepstakesBonusesProps) {
  const [openBonusIndices, setOpenBonusIndices] = useState<number[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const toggleBonus = (index: number) => {
    setOpenBonusIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  // Function to extract bonus type from __typename
  const extractBonusType = (typename?: string): string => {
    if (!typename) return '';
    
    // Check if the typename follows the pattern SweepstakesPositives_negatives{Type}
    const match = typename.match(/SweepstakesBonuses([A-Za-z]+)_bonus/);
    if (match && match[1]) {
      // Convert camelCase to normal text with spaces (e.g., WelcomeBonus -> Welcome Bonus)
      return match[1].replace(/([A-Z])/g, ' $1').trim();
    }
    return '';
  };

  return (
    <>
      <div className="p-6">
      {bonuses && bonuses.length > 0 ? (
        <div>
          {bonuses.map((bonus, index) => {
            if (!bonus) return null;
            
            // Extract bonus type from __typename
            const bonusType = extractBonusType(bonus.__typename);

            return (
              <div key={index} className="mb-8">
                {/* Bonus type header outside the card */}
                {bonusType && (
                  <div className="flex items-center mb-2 px-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-grey-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    <h3 className="text-xl font-bold text-grey-700 dark:text-grey-400 uppercase tracking-wide">
                      {bonusType} Bonus
                    </h3>
                  </div>
                )}
                
                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                  <div className="flex flex-col">
                    {/* Bonus title */}
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="font-bold text-2xl text-purple-800 dark:text-purple-200 uppercase"> {bonus.bonus_title || "DEPOSIT BONUS"}</span>
                    </div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Left section - bonus details */}
                      <div className="md:col-span-2 space-y-2">
                        {/* Show standard sections as there are no detailed bonus properties */}
                        <div className="border border-grey-400 dark:border-purple-400 rounded-md overflow-hidden">
                          <div 
                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
                            onClick={() => toggleBonus(index)}
                          >
                            <div className="flex items-center gap-3">
                              <FaGift className="text-2xl text-purple-600 dark:text-purple-400 mr-2"/>
                              <span className="font-large text-md text-grey-700 dark:text-grey-300">Bonus description</span>
                            </div>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-4 w-4 text-purple-400 transition-transform duration-200 ${openBonusIndices.includes(index) ? 'transform rotate-180' : ''}`} 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>

                          {openBonusIndices.includes(index) && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                              {bonus.bonus_description ? (
                                <TinaMarkdown 
                                  content={bonus.bonus_description}
                                  components={{
                                    mermaid(props) {
                                      if (!props || !props.value) return <></>;
                                      return <MermaidElement value={props.value} />;
                                    }
                                  }}
                                />
                              ) : (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  No description available for this bonus.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Additional standard sections can be added here if needed */}
                      </div>

                      {/* Right section - How to get the bonus */}
                      <div className="md:col-span-1">
                        <div className="border border-gray-200 dark:border-gray-700 p-5 rounded-md bg-white dark:bg-gray-800">
                          <h4 className="text-center text-lg font-medium mb-4 text-purple-800 dark:text-purple-200">
                            HOW TO GET BONUS?
                          </h4>
                          <p className="text-center mb-4 text-gray-600 dark:text-gray-400">
                            Use promo code in your account
                          </p>
                          <div className="relative">
                            <h3 className="text-xl text-center my-5 font-bold text-purple-900 dark:text-purple-100">
                              <button 
                                onClick={() => copyToClipboard(bonus.bonus_code || "")}
                                className="border-2 border-grey-600 rounded-md px-4 py-2 inline-flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors duration-200 uppercase"
                                aria-label="Copy bonus code"
                                title={bonus.bonus_code && bonus.bonus_code.length > 12 ? bonus.bonus_code : "Copy to clipboard"}
                              >
                                {bonus.bonus_code ? 
                                  (bonus.bonus_code.length > 12 ? 
                                    `${bonus.bonus_code.substring(0, 10)}...` : 
                                    bonus.bonus_code) : 
                                  "BONUS"}
                                {copiedCode === bonus.bonus_code ? 
                                  <FaClipboardCheck className="text-purple-500" /> : 
                                  <FaClipboard className="text-purple-500" />
                                }
                              </button>
                            </h3>
                          </div>

                          <Link
                            href={bonus.bonus_link || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white hover:text-white font-medium py-3 px-4 rounded-md flex items-center justify-center gap-2 mb-5 transition-colors duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Get Bonus
                          </Link>
                   
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No bonuses available for this sweepstakes.</p>
      )}
      </div>
    </>
  );
} 