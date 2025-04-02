"use client";
import React from "react";
import Image from "next/image";
import { format, differenceInDays, isBefore, isAfter } from "date-fns";
import { tinaField, useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { SweepstakesItemQueryQuery } from "@/tina/__generated__/types";
import { useLayout } from "@/components/layout/layout-context";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { components } from "@/components/mdx-components";
import { FaRegClock, FaTrophy, FaUser } from "react-icons/fa";
import { IoTicketOutline, IoCalendarOutline, IoAlertCircleOutline } from "react-icons/io5";
import { FaCoins, FaGift } from "react-icons/fa6";
import { MdTimelapse } from "react-icons/md";
import SocialShare from "@/components/social/SocialShare";
import { usePathname } from "next/navigation";

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

type SweepstakesClientPageProps = {
  data: {
    data: SweepstakesItemQueryQuery;
    variables: {
      relativePath: string;
    };
    query: string;
  };
}

export default function SweepstakesClientPage(props: SweepstakesClientPageProps) {
  const { theme } = useLayout();
  const { data } = useTina(props.data);
  const post = data.sweepstakes;
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

  // Simulating ticket information - integrate with your actual ticket system
  const availableTickets = 4;

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

            {post.heroImg && (
              <div 
                data-tina-field={tinaField(post, "heroImg")}
                className="relative mx-auto mb-6"
              >
                <Image
                  src={post.heroImg}
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
                data-tina-field={tinaField(post, "_body")}
              >
                {post.excerpt ? (
                  <TinaMarkdown content={post.excerpt} />
                ) : (
                  <div className="prose dark:prose-dark">
                    <TinaMarkdown
                      content={post._body}
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
              <button 
                className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-full font-medium transition duration-200"
              >
                Enter Sweepstake
              </button>
              
              <div className="flex items-center">
                <FaCoins className="text-yellow-500 mr-2" />
                <span className="font-medium">{post.costs || "Free"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sweepstake Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
              Sweepstake Details
            </h3>

            <div className="border rounded-lg p-4 mb-6">
              <div className="grid grid-cols-[auto_1fr] gap-y-6 gap-x-4">
                {/* Prize Pool */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaGift className="text-gray-500 text-xl" />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Prize Pool</span>
                    <span 
                      className="text-gray-600 dark:text-gray-400"
                      data-tina-field={tinaField(post, "prize_pool")}
                    >
                      {post.prize_pool || "$100 + 8,000 Coins"}
                    </span>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 mt-4"></div>
                </div>

                {/* Prizes */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaTrophy className="text-gray-500 text-xl" />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Prizes</span>
                    <span 
                      className="text-gray-600 dark:text-gray-400"
                      data-tina-field={tinaField(post, "prizes")}
                    >
                      {post.prizes || "2 prizes ($50 + 4,000 Coins per winner)"}
                    </span>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 mt-4"></div>
                </div>

                {/* Start Date */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <IoCalendarOutline className="text-gray-500 text-xl" />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Start Date</span>
                    <span 
                      className="text-gray-600 dark:text-gray-400"
                      data-tina-field={tinaField(post, "start_date")}
                    >
                      {formattedStartDate || "April 01, 2025 at 12:00 am GMT-4"}
                    </span>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 mt-4"></div>
                </div>

                {/* End Date */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <IoCalendarOutline className="text-gray-500 text-xl" />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">End Date</span>
                    <span 
                      className="text-gray-600 dark:text-gray-400"
                      data-tina-field={tinaField(post, "end_date")}
                    >
                      {formattedEndDate}
                    </span>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 mt-4"></div>
                </div>

                {/* Eligibility */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaUser className="text-gray-500 text-xl" />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">Eligibility</span>
                      <IoAlertCircleOutline className="text-gray-400 cursor-pointer" />
                    </div>
                    <span 
                      className="text-gray-600 dark:text-gray-400"
                      data-tina-field={tinaField(post, "eligibility")}
                    >
                      {post.eligibility || "Level 2+ users"}
                    </span>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 mt-4"></div>
                </div>

                {/* Entry Frequency */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MdTimelapse className="text-gray-500 text-xl" />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">Entry Frequency</span>
                      <IoAlertCircleOutline className="text-gray-400 cursor-pointer" />
                    </div>
                    <span 
                      className="text-gray-600 dark:text-gray-400"
                      data-tina-field={tinaField(post, "entry_frequency")}
                    >
                      {post.entry_frequency || "4 entries per day"}
                    </span>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 mt-4"></div>
                </div>

                {/* Entry Limit */}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <IoAlertCircleOutline className="text-gray-500 text-xl" />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">Entry Limit</span>
                      <IoAlertCircleOutline className="text-gray-400 cursor-pointer" />
                    </div>
                    <span 
                      className="text-gray-600 dark:text-gray-400"
                      data-tina-field={tinaField(post, "entry_limit")}
                    >
                      {post.entry_limit || "40 entries per user"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h4 className="text-lg  text-center font-medium mb-3 text-gray-800 dark:text-white">
                Additional Info:
              </h4>
              <div className="flex items-start justify-start flex-col">
                  <TinaMarkdown
                      content={post._body}
                      components={{
                        ...components,
                      }}
                    />
              </div>
              
              {/* Social Share Component */}
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-white text-center">
                  Share this Sweepstake:
                </h4>
                <div className="flex justify-center">
                  <SocialShare 
                    url={shareUrl} 
                    title={shareTitle} 
                    iconSize={36}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}