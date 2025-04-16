"use client";

import React from "react";
import type { Template } from "tinacms";
import { Container } from "../layout/container";
import { Section } from "../layout/section";
import PositionBanner from "../banners/PositionBanner";
import { AnimatedTitle } from "../ui/animated-title";

// Pattern options type
type PatternType = 
  | "none" 
  | "diagonal-lines" 
  | "dots" 
  | "grid" 
  | "zigzag" 
  | "waves" 
  | "honeycomb"
  | "circuit-board"
  | "card-suits"
  | "poker-chips"
  | "dice"
  | "casino-carpet";

// Define our custom interface for Position Banner block
interface PositionBannerBlock {
  title?: string;
  subtitle?: string;
  maxBanners?: number;
  position: "top" | "center" | "bottom";
  width?: "small" | "medium" | "large";
  color?: "default" | "tint" | "primary" | "green" | "white" | "purple" | "orange" | "yellow" | "red" | "pink" | "teal" | "blue";
  pattern?: PatternType;
  patternOpacity?: number;
  customClass?: string;
  animatedTitle?: boolean;
}

export const PositionBannerBlockComponent = ({ data }: { data: PositionBannerBlock }) => {
  // Map width to container size
  const containerSize = data.width === "small" ? "small" : 
                         data.width === "medium" ? "medium" : "large";
  
  // Combine with custom classes
  const bannerClassNames = [
    "w-full py-0",
    data.customClass || ""
  ].filter(Boolean).join(" ");
  
  // Get opacity class based on patternOpacity
  const getOpacityClass = () => {
    // Default to 10% if not specified
    const opacityValue = data.patternOpacity || 10;
    
    // Map percentage values to Tailwind opacity classes
    if (opacityValue <= 5) return "before:opacity-5";
    if (opacityValue <= 10) return "before:opacity-10";
    if (opacityValue <= 20) return "before:opacity-20";
    if (opacityValue <= 25) return "before:opacity-25";
    if (opacityValue <= 30) return "before:opacity-30";
    if (opacityValue <= 40) return "before:opacity-40";
    if (opacityValue <= 50) return "before:opacity-50";
    if (opacityValue <= 60) return "before:opacity-60";
    if (opacityValue <= 70) return "before:opacity-70";
    if (opacityValue <= 75) return "before:opacity-75";
    if (opacityValue <= 80) return "before:opacity-80";
    if (opacityValue <= 90) return "before:opacity-90";
    if (opacityValue <= 95) return "before:opacity-95";
    return "before:opacity-100";
  };
  
  // Generate pattern styles based on selected pattern
  const getPatternClasses = () => {
    if (data.color === "default" || !data.pattern || data.pattern === "none") return "";

    // Base classes for all patterns
    const baseClasses = [
      "relative",
      "overflow-hidden",
      "before:absolute",
      "before:inset-0",
      getOpacityClass(),
      "before:pointer-events-none",
      "before:z-0",
      "before:content-['']"
    ];

    // Pattern-specific background
    let patternBg = "";
    
    switch (data.pattern) {
      case "diagonal-lines":
        patternBg = "before:bg-[repeating-linear-gradient(45deg,currentColor,currentColor_1px,transparent_1px,transparent_10px)]";
        break;
      case "dots":
        patternBg = "before:bg-[radial-gradient(currentColor_2px,transparent_2px)] before:bg-[size:20px_20px]";
        break;
      case "grid":
        patternBg = "before:bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] before:bg-[size:20px_20px]";
        break;
      case "zigzag":
        patternBg = "before:bg-[linear-gradient(135deg,currentColor_25%,transparent_25%),linear-gradient(225deg,currentColor_25%,transparent_25%)] before:bg-[size:20px_20px]";
        break;
      case "waves":
        patternBg = "before:bg-[repeating-radial-gradient(circle_at_0_0,transparent_0,currentColor_1px,currentColor_2px,transparent_3px)] before:bg-[size:20px_20px]";
        break;
      case "honeycomb":
        patternBg = "before:bg-[radial-gradient(circle_farthest-side_at_0%_33%,currentColor_23%,transparent_24%),radial-gradient(circle_farthest-side_at_100%_33%,currentColor_23%,transparent_24%),radial-gradient(circle_farthest-side_at_100%_66%,currentColor_23%,transparent_24%),radial-gradient(circle_farthest-side_at_0%_66%,currentColor_23%,transparent_24%)] before:bg-[size:40px_60px]";
        break;
      case "circuit-board":
        patternBg = "before:bg-[radial-gradient(circle_5px_at_25px_25px,currentColor_3%,transparent_3%),radial-gradient(circle_2px_at_17px_17px,currentColor_3%,transparent_3%)] before:bg-[size:50px_50px]";
        break;
      case "card-suits":
        patternBg = "before:bg-[radial-gradient(circle_4px_at_12px_12px,currentColor_20%,transparent_21%),radial-gradient(circle_4px_at_32px_12px,currentColor_20%,transparent_21%),radial-gradient(circle_4px_at_22px_22px,currentColor_20%,transparent_21%),radial-gradient(circle_4px_at_12px_32px,currentColor_20%,transparent_21%),radial-gradient(circle_4px_at_32px_32px,currentColor_20%,transparent_21%)] before:bg-[size:44px_44px]";
        break;
      case "poker-chips":
        patternBg = "before:bg-[repeating-radial-gradient(circle,currentColor,currentColor_2px,transparent_2px,transparent_8px),repeating-radial-gradient(circle,currentColor,currentColor_1px,transparent_1px,transparent_4px)] before:bg-[size:30px_30px]";
        break;
      case "dice":
        patternBg = "before:bg-[radial-gradient(circle_2px_at_10px_10px,currentColor_40%,transparent_41%),radial-gradient(circle_2px_at_20px_20px,currentColor_40%,transparent_41%),radial-gradient(circle_2px_at_30px_10px,currentColor_40%,transparent_41%),radial-gradient(circle_2px_at_10px_30px,currentColor_40%,transparent_41%),radial-gradient(circle_2px_at_30px_30px,currentColor_40%,transparent_41%)] before:bg-[size:40px_40px]";
        break;
      case "casino-carpet":
        patternBg = "before:bg-[repeating-conic-gradient(currentColor_0deg,currentColor_5deg,transparent_5deg,transparent_30deg,currentColor_30deg,currentColor_35deg,transparent_35deg,transparent_60deg,currentColor_60deg,currentColor_65deg,transparent_65deg,transparent_90deg)] before:bg-[size:40px_40px]";
        break;
      default:
        patternBg = "";
    }
    
    return [...baseClasses, patternBg].join(" ");
  };
  
  const patternClasses = getPatternClasses();
  
  return (
    <Section color={data.color}>
      <div className={`py-2 ${patternClasses}`}>
        <Container size={containerSize}>
          <div className="mb-4 md:mb-6 lg:mb-8 relative z-10">
            {data.title && (
              <AnimatedTitle 
                className="mb-2 text-2xl font-semibold md:mb-3 md:text-3xl lg:text-4xl"
                animated={data.animatedTitle}
              >
                {data.title}
              </AnimatedTitle>
            )}
            
            {data.subtitle && (
              <p className="text-base md:text-lg text-muted-foreground">
                {data.subtitle}
              </p>
            )}
          </div>
          
          {/* Use the PositionBanner component */}
          <PositionBanner 
            maxBanners={data.maxBanners || 1}
            position={data.position}
            className={`${bannerClassNames} relative z-10`}
          />
        </Container>
      </div>
    </Section>
  );
};

export const positionBannerBlockSchema: Template = {
  name: "positionBanner",
  label: "Position Banner",
  ui: {
    previewSrc: "/blocks/position-banner.png",
    defaultItem: {
      title: "Featured Banners",
      subtitle: "Check out our featured promotions",
      maxBanners: 1,
      position: "center",
      width: "large",
      color: "default",
      pattern: "none",
      patternOpacity: 10,
      animatedTitle: false
    },
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      label: "Subtitle",
      name: "subtitle",
    },
    {
      type: "number",
      label: "Number of Banners to Display",
      name: "maxBanners",
      ui: {
        validate: (value) => {
          if (value < 1) return "Must display at least 1 banner";
          if (value > 20) return "Cannot display more than 20 banners";
        },
      },
    },
    {
      type: "string",
      label: "Position",
      name: "position",
      options: [
        { label: "Top", value: "top" },
        { label: "Center", value: "center" },
        { label: "Bottom", value: "bottom" },
      ],
    },
    {
      type: "string",
      label: "Custom Class",
      name: "customClass",
      description: "Additional Tailwind classes to apply",
    },
    {
      type: "string",
      label: "Width",
      name: "width",
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
        { label: "Custom", value: "custom" },
      ],
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Primary", value: "primary" },
        { label: "Green", value: "green" },
        { label: "White", value: "white" },
        { label: "Purple", value: "purple" },
        { label: "Orange", value: "orange" },
        { label: "Tint", value: "tint" },
        { label: "Yellow", value: "yellow" },
        { label: "Red", value: "red" },
        { label: "Pink", value: "pink" },
        { label: "Teal", value: "teal" },
        { label: "Blue", value: "blue" },
      ],
    },
    {
      type: "string",
      label: "Background Pattern",
      name: "pattern",
      description: "Add a decorative background pattern (only applies when color is not default)",
      options: [
        { label: "None", value: "none" },
        { label: "Diagonal Lines", value: "diagonal-lines" },
        { label: "Dots", value: "dots" },
        { label: "Grid", value: "grid" },
        { label: "Zigzag", value: "zigzag" },
        { label: "Waves", value: "waves" },
        { label: "Honeycomb", value: "honeycomb" },
        { label: "Circuit Board", value: "circuit-board" },
        { label: "Card Suits", value: "card-suits" },
        { label: "Poker Chips", value: "poker-chips" },
        { label: "Dice", value: "dice" },
        { label: "Casino Carpet", value: "casino-carpet" },
      ],
    },
    {
      type: "number",
      label: "Pattern Opacity",
      name: "patternOpacity",
      description: "Adjust pattern opacity (1-100)",
      ui: {
        validate: (value) => {
          if (value < 1) return "Minimum opacity is 1";
          if (value > 100) return "Maximum opacity is 100";
        },
      },
    },
    {
      type: "boolean",
      label: "Animated Title",
      name: "animatedTitle",
      description: "Enable gradient animation effect on title"
    },
  ],
}; 