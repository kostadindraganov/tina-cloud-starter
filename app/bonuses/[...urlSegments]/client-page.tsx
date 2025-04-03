"use client";
import React from "react";
import Image from "next/image";
import { format, differenceInDays, isBefore, isAfter } from "date-fns";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { BonusesItemQueryQuery } from "@/tina/__generated__/types";
import { useLayout } from "@/components/layout/layout-context";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { components } from "@/components/mdx-components";
import { FaRegClock, FaTrophy, FaUser } from "react-icons/fa";
import { IoTicketOutline, IoCalendarOutline, IoAlertCircleOutline } from "react-icons/io5";
import { FaCoins, FaGift } from "react-icons/fa6";
import { MdTimelapse } from "react-icons/md";
import { usePathname } from "next/navigation";
import Link from "next/link";

const titleColorClasses = {
  blue: "from-blue-400 to-blue-600 dark:from-blue-300 dark:to-blue-500",
  teal: "from-teal-400 to-teal-600 dark:from-teal-300 dark:to-teal-500",
  green: "from-green-400 to-green-600",
  red: "from-red-400 to-red-600",
  pink: "from-pink-300 to-pink-500",
  purple:
    "from-purple-400 to-purple-600 dark:from-purple-300 dark:to-purple-500",
  orange:
    "from-orange-300 to-orange-600 dark:from-orange-200 dark:to-orange-500",
  yellow:
    "from-yellow-400 to-yellow-500 dark:from-yellow-300 dark:to-yellow-500",
};

  type BonusesClientPageProps = {
  data: {
    data: BonusesItemQueryQuery;
    variables: {
      relativePath: string;
    };
    query: string;
  };
}

export default function BonusesClientPage(props: BonusesClientPageProps) {
  const { theme } = useLayout();
  const { data } = useTina(props.data);
  const post = data.bonuses;
  const pathname = usePathname();
  
  // Get the full URL for sharing
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${pathname}` 
    : '';
  const shareTitle = post.title || 'Check out this sweepstake!';

  // Format dates
  const startDate = new Date(post.start_date || "");
  let formattedStartDate = "";
  if (!isNaN(startDate.getTime())) {
    formattedStartDate = format(startDate, "MMMM dd, yyyy 'at' h:mm a 'GMT-4'");
  }

  const endDate = new Date(post.end_date || "");
  let formattedEndDate = "";
  if (!isNaN(endDate.getTime())) {
    formattedEndDate = format(endDate, "MMMM dd, yyyy 'at' h:mm a 'GMT-4'");
  } else {
    formattedEndDate = format(new Date(), "MMM d, yyyy");
  }

  // Calculate status and display text
  const currentDate = new Date();
  let statusDisplay = "";
  let statusIcon = <FaRegClock className="mr-2" />;
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    statusDisplay = `Ends on ${format(endDate, "MMM d, yyyy")}`;
  } else if (isBefore(currentDate, startDate)) {
    // Upcoming
    const daysToStart = differenceInDays(startDate, currentDate);
    statusDisplay = daysToStart === 0 
      ? "Starts today" 
      : daysToStart === 1 
        ? "Starts in 1 day" 
        : `Starts in ${daysToStart} days`;
    statusIcon = <IoCalendarOutline className="mr-2" />;
  } else if (isAfter(currentDate, endDate)) {
    // Ended
    statusDisplay = `Ended on ${format(endDate, "MMM d, yyyy")}`;
    statusIcon = <FaRegClock className="mr-2" />;
  } else {
    // Active
    statusDisplay = `Ends on ${format(endDate, "MMM d, yyyy")}`;
    statusIcon = <FaRegClock className="mr-2" />;
  }


  return (
    <Section className="flex-1">
      <Container width="small" className="flex-1" size="large">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto mb-8">
          <div className="p-6">
            <h2
              data-tina-field={tinaField(post, "title")}
              className="text-2xl font-bold mb-4 text-gray-800 dark:text-white"
            >
              {post.title}
            </h2>

            {post.logo && (
              <div 
                data-tina-field={tinaField(post, "logo")}
                className="relative mx-auto mb-6"
              >
                <Image
                  src={post.logo}
                  alt={post.title}
                  width={600}
                  height={300}
                  className="rounded-lg mx-auto"
                />
              </div>
            )}

            <div className="mb-6">
              <div
                className="text-gray-700 dark:text-gray-300 mb-4"
                data-tina-field={tinaField(post, "excerpt")}
              >
                {post.excerpt ? (
                  <TinaMarkdown content={post.excerpt} />
                ) : (
                  <div className="prose dark:prose-dark">
                    <TinaMarkdown
                      content={post.excerpt}
                      components={{
                        ...components,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Status display - Combined start/end info */}
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
              {statusIcon}
              <span>{statusDisplay}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <Link target="_blank" href={post.affiliate_url || "#"}>
                <button 
                  className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-full font-medium transition duration-200"
                >
                 Claim Bonus
                </button>
              </Link>
              <Link target="_blank" href={post.areview_url || "#"}>
                <button 
                  className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-full font-medium transition duration-200"
                >
                 Review
                </button>
              </Link>
              <div className="flex items-center">
                <FaCoins className="text-yellow-500 mr-2" />
                <span className="font-medium">{post.bonus_amount || "Free"}</span>
              </div>
            </div>

            {/* Additional Bonus Details */}
            <div className="mt-8 space-y-4 border-t pt-4 dark:border-gray-700">
              {post.bonus_title && (
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FaTrophy className="mr-2 text-yellow-500" />
                  <span className="font-medium">Bonus Title:</span>
                  <span className="ml-2">{post.bonus_title}</span>
                </div>
              )}

              {post.bonus_type && (
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <FaGift className="mr-2 text-purple-500" />
                  <span className="font-medium">Type:</span>
                  <span className="ml-2">{post.bonus_type}</span>
                </div>
              )}

              {post.bonus_code && (
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <IoTicketOutline className="mr-2 text-blue-500" />
                  <span className="font-medium">Bonus Code:</span>
                  <code className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{post.bonus_code}</code>
                </div>
              )}


              <div className="flex flex-col space-y-2 text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                  <MdTimelapse className="mr-2 text-green-500" />
                  <span className="font-medium">Duration:</span>
                </div>
                <div className="ml-6 space-y-1">
                  <div>Start: {formattedStartDate || "Not specified"}</div>
                  <div>End: {formattedEndDate}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </Section>
  );
}