"use client";
import React from "react";
import { tinaField } from "tinacms/dist/react";
import type { Template } from "tinacms";
import { Container } from "../layout/container";
import { Section } from "../layout/section";
import { 
  CircleDollarSign, 
  Dices, 
  Gift, 
  Star, 
  Scale, 
  Users,
  LucideIcon,
  icons
} from 'lucide-react';

// Define the interface for button items
interface ButtonItem {
  label: string;
  iconName: string;
  link: string;
}

// Define color gradient map
const backgroundColorMap: Record<string, string> = {
  'dark': 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
  'black': 'bg-black',
  'navy': 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
  'purple': 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900',
  'emerald': 'bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900',
  'crimson': 'bg-gradient-to-br from-gray-900 via-red-900 to-gray-900',
  'midnight': 'bg-gradient-to-r from-gray-900 to-slate-900',
  'charcoal': 'bg-zinc-900',
  // New green gradient options
  'forest': 'bg-gradient-to-br from-green-900 via-green-800 to-green-900',
  'mint': 'bg-gradient-to-br from-green-800 via-emerald-600 to-green-700',
  'lime': 'bg-gradient-to-br from-green-700 via-lime-600 to-green-700',
  'jade': 'bg-gradient-to-br from-teal-900 via-green-800 to-teal-800',
  'evergreen': 'bg-gradient-to-r from-green-900 to-emerald-800',
};

// Background position options
const positionMap: Record<string, string> = {
  'center': 'center',
  'top': 'top',
  'bottom': 'bottom',
  'left': 'left',
  'right': 'right',
  'top-left': 'top left',
  'top-right': 'top right',
  'bottom-left': 'bottom left',
  'bottom-right': 'bottom right',
};

// Define the interface for the component props
interface CasinoInfoGridProps {
  headline?: string;
  subheadline?: string;
  buttons?: ButtonItem[];
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  backgroundOpacity?: number;
}

// Function to get icon component by name
const getIconByName = (iconName: string): React.ReactNode => {
  const IconComponent = icons[iconName as keyof typeof icons] as LucideIcon;
  return IconComponent ? <IconComponent className="w-6 h-6" /> : <CircleDollarSign className="w-6 h-6" />;
};

export const CasinoInfoGrid = ({ data }: { data: CasinoInfoGridProps }) => {
  // Default buttons if none are provided
  const defaultButtons = [
    { label: "CASINOS", iconName: "CircleDollarSign", link: "#" },
    { label: "GAMES", iconName: "Dices", link: "#" },
    { label: "BONUSES", iconName: "Gift", link: "#" },
    { label: "REVIEWS", iconName: "Star", link: "#" },
    { label: "COMPLAINTS", iconName: "Scale", link: "#" },
    { label: "FORUM", iconName: "Users", link: "#" },
  ];

  // Use provided buttons or fallback to defaults
  const gridButtons = data.buttons && data.buttons.length > 0 ? data.buttons : defaultButtons;
  
  // Determine background color class
  const backgroundColorClass = data.backgroundColor && backgroundColorMap[data.backgroundColor] 
    ? backgroundColorMap[data.backgroundColor] 
    : backgroundColorMap['dark'];
    
  // Background opacity (default to 50% if not specified)
  const opacity = data.backgroundOpacity !== undefined ? data.backgroundOpacity : 50;
  
  // Get background position
  const position = data.backgroundPosition && positionMap[data.backgroundPosition]
    ? positionMap[data.backgroundPosition]
    : positionMap['center'];
  
  // Style for background image
  const backgroundImageStyle = data.backgroundImage ? {
    backgroundImage: `url(${data.backgroundImage})`,
    backgroundSize: 'fill',
    backgroundPosition: position,
    backgroundRepeat: 'no-repeat',
  } : {};

  return (
    <Section>
      <div className="relative w-full py-16 " data-tina-field={tinaField(data)}>
        {/* Background layer with image and/or color */}
        <div 
          className="absolute inset-0 z-0"
          style={backgroundImageStyle}
          data-tina-field={tinaField(data, 'backgroundImage')}
        ></div>
        
        {/* Overlay with color and opacity */}
        <div 
          className={`absolute inset-0 z-10 ${backgroundColorClass}`}
          style={{ opacity: opacity / 100 }}
          data-tina-field={tinaField(data, 'backgroundColor')}
        ></div>
        
        {/* Content */}
        <div className="relative z-20 w-full">
          <Container size="large">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left section (60%) */}
              <div className="w-full md:w-3/5 space-y-4 px-4 md:px-8">
                <h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                  data-tina-field={tinaField(data, 'headline')}
                >
                  {data.headline || "Explore the world's biggest source of information about online casinos"}
                </h2>
                <p 
                  className="text-lg text-gray-100"
                  data-tina-field={tinaField(data, 'subheadline')}
                >
                  {data.subheadline || "Up-to-date reviews of all online casinos, bonus database, global community, complaint help, and more."}
                </p>
              </div>
              
              {/* Right section (40%) with grid */}
              <div className="w-full md:w-2/5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gridButtons.map((button, index) => (
                    <a 
                      key={index}
                      href={button.link}
                      className="p-4 rounded-lg border-2 border-green-400 bg-gray-800/50 flex flex-col items-center justify-center text-center gap-2 transition-all hover:bg-gray-700/50 hover:border-green-300 hover:shadow-[0_0_15px_rgba(74,222,128,0.5)] group"
                      data-tina-field={tinaField(data.buttons, index)}
                    >
                      <div className="text-green-400 group-hover:text-green-300 transition-colors">
                        {getIconByName(button.iconName)}
                      </div>
                      <span className="text-white text-sm font-semibold">{button.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </Section>
  );
};

export const casinoInfoGridSchema: Template = {
  name: "casinoInfoGrid",
  label: "Casino Info Grid",
  ui: {
    previewSrc: "/blocks/casino-info-grid.png",
    defaultItem: {
      headline: "Explore the world's biggest source of information about online casinos",
      subheadline: "Up-to-date reviews of all online casinos, bonus database, global community, complaint help, and more.",
      backgroundColor: "dark",
      backgroundOpacity: 50,
      backgroundPosition: "center",
      buttons: [
        { label: "CASINOS", iconName: "CircleDollarSign", link: "#" },
        { label: "GAMES", iconName: "Dices", link: "#" },
        { label: "BONUSES", iconName: "Gift", link: "#" },
        { label: "REVIEWS", iconName: "Star", link: "#" },
        { label: "COMPLAINTS", iconName: "Scale", link: "#" },
        { label: "FORUM", iconName: "Users", link: "#" },
      ]
    },
  },
  fields: [
    {
      type: "string",
      label: "Headline",
      name: "headline",
      description: "The main headline text for the block",
    },
    {
      type: "string",
      label: "Subheadline",
      name: "subheadline",
      description: "The supporting text below the headline",
    },
    {
      type: "image",
      label: "Background Image",
      name: "backgroundImage",
      description: "Optional background image for the section",
    },
    {
      type: "string",
      label: "Background Position",
      name: "backgroundPosition",
      description: "Position of the background image",
      options: [
        { label: "Center (Default)", value: "center" },
        { label: "Top", value: "top" },
        { label: "Bottom", value: "bottom" },
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
        { label: "Top Left", value: "top-left" },
        { label: "Top Right", value: "top-right" },
        { label: "Bottom Left", value: "bottom-left" },
        { label: "Bottom Right", value: "bottom-right" },
      ],
    },
    {
      type: "string",
      label: "Background Color",
      name: "backgroundColor",
      description: "The background style/color for the container",
      options: [
        { label: "Dark Gradient (Default)", value: "dark" },
        { label: "Pure Black", value: "black" },
        { label: "Navy Blue", value: "navy" },
        { label: "Deep Purple", value: "purple" },
        { label: "Emerald Dark", value: "emerald" },
        { label: "Crimson Dark", value: "crimson" },
        { label: "Midnight", value: "midnight" },
        { label: "Charcoal", value: "charcoal" },
        // New green gradient options
        { label: "Forest Green", value: "forest" },
        { label: "Mint Green", value: "mint" },
        { label: "Lime Green", value: "lime" },
        { label: "Jade Green", value: "jade" },
        { label: "Evergreen", value: "evergreen" },
      ],
    },
    {
      type: "number",
      label: "Background Opacity",
      name: "backgroundOpacity",
      description: "Control the opacity of the background color (0-100)",
      ui: {
        validate: (value) => {
          if (value < 0 || value > 100) {
            return "Opacity must be between 0 and 100";
          }
        },
      },
    },
    {
      type: "object",
      label: "Buttons",
      name: "buttons",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.label || "Button" };
        },
      },
      fields: [
        {
          type: "string",
          label: "Label",
          name: "label",
          description: "The button text",
        },
        {
          type: "string",
          label: "Icon Name",
          name: "iconName",
          description: "Name of the Lucide icon (e.g., CircleDollarSign, Dices, Gift, Star, Scale, Users)",
          options: [
            { label: "Casino Chip", value: "CircleDollarSign" },
            { label: "Dice", value: "Dices" },
            { label: "Gift", value: "Gift" },
            { label: "Star", value: "Star" },
            { label: "Scale", value: "Scale" },
            { label: "Users", value: "Users" },
            { label: "Award", value: "Award" },
            { label: "CheckCircle", value: "CheckCircle" },
            { label: "BarChart", value: "BarChart" },
            { label: "HelpCircle", value: "HelpCircle" },
            { label: "Heart", value: "Heart" },
            { label: "Trophy", value: "Trophy" },
          ]
        },
        {
          type: "string",
          label: "Link",
          name: "link",
          description: "URL the button links to",
        },
      ],
    },
  ],
}; 