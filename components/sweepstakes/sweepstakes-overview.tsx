import React from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import MermaidElement from "@/components/mermaid-renderer";
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@/components/ui/disclosure";
import { FaInfoCircle } from "react-icons/fa";

import { SweepstakesGamesOverview } from "@/components/sweepstakes/sweepstakes-games-overview";
import { SweepstakesProsCons } from "@/components/sweepstakes/sweepstakes-pros-cons";
import { SweepstakesBenefits } from "@/components/sweepstakes/sweepstakes-benefits";
import { SweepstakesSupportMethods } from "@/components/sweepstakes/sweepstakes-support-methods";
import { SweepstakesItemQueryQuery } from "@/tina/__generated__/types";
import { MdOutlineSupportAgent } from "react-icons/md";
import PositionBanner from "../banners/PositionBanner";

interface SweepstakesOverviewProps {
  sweepstakes: SweepstakesItemQueryQuery["sweepstakes"];
}

export function SweepstakesOverview({ sweepstakes }: SweepstakesOverviewProps) {
  return (
    <div className="prose dark:prose-dark max-w-none mt-6 mb-4">
      {/* Benefits Component */}
      <SweepstakesBenefits sweepstakes={sweepstakes}/>
      
      {/* Pros and Cons Component */}
      <div className="mb-10 w-full">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center justify-center">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
          <span className="mx-4">Sweepstakes Highlights</span>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
        </h3>
        <SweepstakesProsCons positives_negatives={sweepstakes.positives_negatives || []} />
      </div>
      
      {/* Games Overview Component - more minimal */}
      <div className="mb-8 w-full">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center justify-center">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
          <span className="mx-4">Games</span>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
        </h3>
        <SweepstakesGamesOverview 
          gameCategories={sweepstakes.game_categories} 
          softwareProviders={sweepstakes.software_providers}
        />
      </div>
      
      {/* Learn More Disclosure Component */}
      <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
        
        <div className="space-y-4">

          <Disclosure className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <DisclosureTrigger>
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <FaInfoCircle className="text-purple-500 text-2xl mr-2" />

                <span className="font-bold text-lg text-grey-500 dark:text-gray-100">More  about {sweepstakes.title}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </DisclosureTrigger>
            <DisclosureContent>
              <div className="p-4 bg-white dark:bg-gray-950">
                <TinaMarkdown
                  content={sweepstakes._body}
                  components={{
                    mermaid({ value }: { value: string }) {
                      return <MermaidElement value={value} />;
                    }
                  }}
                />                        
              </div>
            </DisclosureContent>
          </Disclosure>
          
          <Disclosure className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <DisclosureTrigger>
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <MdOutlineSupportAgent className="text-purple-500 text-2xl" />

                <span className="font-bold text-lg text-gray-700 dark:text-gray-100">Customer support</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </DisclosureTrigger>
            <DisclosureContent>
              <div className="p-4 bg-white dark:bg-gray-950">
                <SweepstakesSupportMethods supportMethods={sweepstakes.customer_support_methods} />
              </div>
            </DisclosureContent>
          </Disclosure>
          <PositionBanner position="bottom" />

        </div>
      </div>
    </div>
  );
} 