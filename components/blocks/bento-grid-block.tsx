"use client";

import React from "react";
import type { Template } from "tinacms";
import { Container } from "../layout/container";
import { Section } from "../layout/section";
import { BentoGrid, BentoCard } from "../ui/bento-grid";
import { AnimatedTitle } from "../ui/animated-title";
import { Icon, IconOptions } from "../icon";

// Define our custom interface for Bento Grid block
interface BentoGridBlock {
  title?: string;
  subtitle?: string;
  width?: "small" | "medium" | "large";
  color?: "default" | "tint" | "primary" | "green" | "white" | "purple" | "orange" | "yellow" | "red" | "pink" | "teal" | "blue" | "forest" | "mint" | "lime" | "jade" | "evergreen";
  customClass?: string;
  animatedTitle?: boolean;
  bgOpacity?: string;
  backgroundImage?: string;
  items?: BentoItem[];
}

interface BentoItem {
  name: string;
  className: string;
  description: string;
  href: string;
  cta: string;
  bgOpacity?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  icon?: {
    name: string;
    color: string;
    style: string;
  };
  imageIcon?: string; // Path to custom image icon
}

export const BentoGridBlockComponent = ({ data }: { data: BentoGridBlock }) => {
  // Map width to container size
  const containerSize = data.width === "small" ? "small" : 
                        data.width === "medium" ? "medium" : "large";
  
  // Combine with custom classes
  const bentoGridClassNames = [
    data.customClass || "",
  ].filter(Boolean).join(" ");
  
  // Create section background style with background image if provided
  const sectionStyle = data.backgroundImage ? {
    backgroundImage: `url(${data.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};
  
  return (
    <Section color={data.color} style={sectionStyle}>
      <Container size={containerSize}>
        <div className="mb-4 md:mb-6 lg:mb-8">
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
        
        {/* Render the BentoGrid component */}
        <BentoGrid className={bentoGridClassNames}>
          {data.items?.map((item, index) => {
            // Create a custom icon component that will render either the Icon or an image
            const CustomIcon = ({ className }: { className: string }) => {
              // Render custom image icon if provided
              if (item.imageIcon) {
                return (
                  <div className={`${className} flex items-center justify-center`}>
                    <img 
                      src={item.imageIcon} 
                      alt={item.name ? `${item.name} icon` : 'Grid icon'} 
                      className="h-auto w-10 md:w-12"
                    />
                  </div>
                );
              }
              
              // Otherwise render the standard icon
              if (!item.icon || !item.icon.name || !IconOptions[item.icon.name]) return null;
              
              return (
                <Icon
                  data={{
                    name: item.icon.name,
                    color: item.icon.color || "blue",
                    style: item.icon.style || "float",
                    size: "large"
                  }}
                  className={className}
                  parentColor={data.color}
                />
              );
            };
            
            // Create background style with proper opacity
            // For background opacity to work, we need a background color first
            let backgroundColor = "";
            let opacityClass = "";
            
            if (item.backgroundColor) {
              backgroundColor = `bg-${item.backgroundColor}`;
              opacityClass = item.bgOpacity || "";
            }

            // Create background element with image or color
            const backgroundElement = (
              <div 
                className={`absolute inset-0 z-0 ${backgroundColor} ${opacityClass}`}
                style={{
                  backgroundImage: item.backgroundImage ? `url(${item.backgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: item.bgOpacity ? 
                    parseFloat(item.bgOpacity.replace("bg-opacity-", "")) / 100 : 1
                }}
              ></div>
            );
            
            return (
              <BentoCard
                key={index}
                name={item.name}
                className={item.className}
                Icon={CustomIcon}
                description={item.description}
                href={item.href}
                cta={item.cta}
                background={backgroundElement}
              />
            );
          })}
        </BentoGrid>
      </Container>
    </Section>
  );
};

export const bentoGridBlockSchema: Template = {
  name: "bentoGrid",
  label: "Bento Grid",
  ui: {
    previewSrc: "/blocks/bento-grid.png",
    defaultItem: {
      title: "Featured Cards",
      subtitle: "Check out our featured products",
      width: "large",
      color: "default",
      animatedTitle: false,
      items: [
        {
          name: "Feature One",
          className: "col-span-3 md:col-span-1",
          description: "Description for feature one",
          href: "#",
          cta: "Learn More",
          bgOpacity: "50",
          backgroundColor: "blue-50",
          icon: {
            name: "BiRocket",
            color: "blue",
            style: "float"
          }
        },
        {
          name: "Feature Two",
          className: "col-span-3 md:col-span-1",
          description: "Description for feature two",
          href: "#",
          cta: "Learn More",
          bgOpacity: "70",
          backgroundColor: "green-50",
          icon: {
            name: "BiDiamond",
            color: "green",
            style: "float"
          }
        },
        {
          name: "Feature Three",
          className: "col-span-3 md:col-span-1",
          description: "Description for feature three",
          href: "#",
          cta: "Learn More",
          bgOpacity: "90",
          backgroundColor: "primary-50",
          icon: {
            name: "BiCog",
            color: "primary",
            style: "float"
          }
        }
      ]
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
      type: "string",
      label: "Width",
      name: "width",
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
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
        { label: "Forest", value: "forest" },
        { label: "Mint", value: "mint" },
        { label: "Lime", value: "lime" },
        { label: "Jade", value: "jade" },
        { label: "Evergreen", value: "evergreen" },
      ],
    },
    {
      type: "string",
      label: "Custom Class",
      name: "customClass",
      description: "Additional Tailwind classes to apply",
    },
    {
      type: "boolean",
      label: "Animated Title",
      name: "animatedTitle",
      description: "Enable gradient animation effect on title"
    },
    {
      type: "image",
      label: "Background Image",
      name: "backgroundImage",
      description: "Background image for the entire section"
    },
    {
      type: "object",
      label: "Bento Grid Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.name };
        },
      },
      fields: [
        {
          type: "string",
          label: "Name",
          name: "name",
          required: true,
        },
        {
          type: "string",
          label: "Class Names",
          name: "className",
          description: "Tailwind classes for grid placement (e.g., col-span-1)",
          required: true,
        },
        {
          type: "string",
          label: "Description",
          name: "description",
          required: true,
        },
        {
          type: "string",
          label: "Link URL",
          name: "href",
          required: true,
        },
        {
          type: "string",
          label: "Call to Action Text",
          name: "cta",
          required: true,
        },
        {
          type: "string",
          label: "Background Color",
          name: "backgroundColor",
          description: "Background color for this card (without the bg- prefix)",
          options: [
            { label: "None", value: "" },
            { label: "Primary 50", value: "primary-50" },
            { label: "Primary 100", value: "primary-100" },
            { label: "Blue 50", value: "blue-50" },
            { label: "Blue 100", value: "blue-100" },
            { label: "Green 50", value: "green-50" },
            { label: "Green 100", value: "green-100" },
            { label: "Red 50", value: "red-50" },
            { label: "Red 100", value: "red-100" },
            { label: "Yellow 50", value: "yellow-50" },
            { label: "Yellow 100", value: "yellow-100" },
            { label: "Purple 50", value: "purple-50" },
            { label: "Purple 100", value: "purple-100" },
            { label: "Pink 50", value: "pink-50" },
            { label: "Pink 100", value: "pink-100" },
            { label: "Teal 50", value: "teal-50" },
            { label: "Teal 100", value: "teal-100" },
            { label: "Gray 50", value: "gray-50" },
            { label: "Gray 100", value: "gray-100" },
          ],
        },
        {
          type: "string",
          label: "Background Opacity",
          name: "bgOpacity",
          description: "Control the opacity of this card's background (percentage)",
          options: [
            { label: "100%", value: "100" },
            { label: "90%", value: "90" },
            { label: "80%", value: "80" },
            { label: "70%", value: "70" },
            { label: "60%", value: "60" },
            { label: "50%", value: "50" },
            { label: "40%", value: "40" },
            { label: "30%", value: "30" },
            { label: "20%", value: "20" },
            { label: "10%", value: "10" },
            { label: "5%", value: "5" },
          ],
        },
        {
          type: "image",
          label: "Background Image",
          name: "backgroundImage",
          description: "Background image for this card (overrides background color)"
        },
        {
          type: "image",
          label: "Custom Image Icon",
          name: "imageIcon",
          description: "Upload a custom image to use as an icon (overrides icon selection)",
        },
        {
          type: "object",
          label: "Icon",
          name: "icon",
          description: "Standard icon (will not be used if custom image is uploaded)",
          fields: [
            {
              type: "string",
              label: "Icon Name",
              name: "name",
              description: "Name of the icon (e.g., BiRocket, BiCog)",
            },
            {
              type: "string",
              label: "Color",
              name: "color",
              options: [
                { label: "Default", value: "default" },
                { label: "Primary", value: "primary" },
                { label: "Blue", value: "blue" },
                { label: "Green", value: "green" },
                { label: "Red", value: "red" },
                { label: "Yellow", value: "yellow" },
                { label: "Purple", value: "purple" },
                { label: "Orange", value: "orange" },
                { label: "Teal", value: "teal" },
                { label: "Pink", value: "pink" },
                { label: "Forest", value: "forest" },
                { label: "Mint", value: "mint" },
                { label: "Lime", value: "lime" },
                { label: "Jade", value: "jade" },
                { label: "Evergreen", value: "evergreen" },
              ],
            },
            {
              type: "string",
              label: "Style",
              name: "style",
              options: [
                { label: "Circle", value: "circle" },
                { label: "Float", value: "float" },
              ],
            },
          ],
        },
      ],
    },
  ],
}; 