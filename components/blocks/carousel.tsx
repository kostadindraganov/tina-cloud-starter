'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { Container } from '../layout/container';
import { Carousel as UICarousel } from '../ui/carousel';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { client } from "@/tina/__generated__/client";

interface SliderItem {
  title?: string;
  image?: { src?: string; alt?: string };
  text?: string;
  buttonText?: string;
  buttonLink?: string;
  start_date?: string;
  end_date?: string;
  affiliate_url?: string;
}

interface TinaSlider {
  _sys: {
    filename: string;
  };
  title: string;
  slider_image: string;
  actions?: Array<{
    label: string;
    type: string;
    icon: boolean;
    link: string;
  }>;
  excerpt?: any;
  start_date?: string;
  end_date?: string;
  affiliate_url?: string;
}

interface CarouselBlockData {
  headline?: string;
  description?: any;
  slides?: SliderItem[];
  useAdminSliders?: boolean;
  color?: string;
  fullWidth?: boolean;
  autoPlay?: boolean;
  showTitles?: boolean;
  start_date?: string;
  end_date?: string;
}

// Skeleton loader component
const CarouselSkeleton = ({ message }: { message?: string }) => {
  return (
    
    <div className=" w-screen aspect-[3/2] max-h-[800px] z-10 relative overflow-hidden">
      {/* Background skeleton */}
      <div className="absolute inset-0 bg-green-200 animate-pulse"></div>
      
      {/* Fake slide content structure */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
        {/* Title skeleton */}
        <div className="h-12 w-3/4 max-w-2xl bg-green-400 rounded-lg animate-pulse"></div>
        
        {/* Excerpt skeleton */}
        <div className="flex flex-col items-center gap-2 w-full max-w-xl">
          <div className="h-4 w-full bg-green-400 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-green-400 rounded animate-pulse"></div>
          <div className="h-4 w-4/6 bg-green-400 rounded animate-pulse"></div>
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex gap-4 mt-4">
          <div className="h-12 w-32 bg-green-400 rounded-full animate-pulse"></div>
          <div className="h-12 w-32 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Message */}
        {message && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-gray-800/70 text-white px-6 py-3 rounded-lg backdrop-blur-sm text-lg font-medium">
              {message}
            </span>
          </div>
        )}
      </div>
      
      {/* Carousel controls skeleton */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-green-400/20 animate-pulse"></div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-green-400/20 animate-pulse"></div>
      
      {/* Indicators skeleton */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="h-2 w-6 bg-white rounded-full animate-pulse"></div>
        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export const Carousel = ({ data }: { data: CarouselBlockData }) => {
  const [adminSliders, setAdminSliders] = useState<TinaSlider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch sliders directly using Tina client if useAdminSliders is enabled
  useEffect(() => {
    if (!data.useAdminSliders) return;
    
    const fetchSliders = async () => {
      setIsLoading(true);
      try {
        const currentDate = new Date().toISOString();
        
        const response = await client.queries.slidersConnection({
          filter: {
            start_date: { before: currentDate },
            end_date: { after: currentDate }
          }
        });
        
        if (!response?.data?.slidersConnection?.edges) {
          throw new Error("No data returned from Tina CMS");
        }
        
        const sliders = response.data.slidersConnection.edges
          .map(edge => edge?.node)
          .filter(Boolean) as TinaSlider[];
          
        setAdminSliders(sliders);
      } catch (error) {
        console.error('Error fetching sliders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSliders();
  }, [data.useAdminSliders]);

  // Transform inline slides to match the format expected by UICarousel
  const processInlineSlides = () => {
    if (!data.slides?.length) return [];
    
    return data.slides
      .filter(Boolean)
      .map((slide, index) => ({
        key: `inline-slide-${index}`,
        title: slide.title || '',
        src: slide.image?.src || '',
        excerpt: slide.text || '',
        affiliate_url: slide.affiliate_url || '',
        actions: slide.buttonLink ? [
          {
            label: slide.buttonText || 'Visit Site',
            type: 'button',
            icon: false,
            link: slide.buttonLink
          }
        ] : []
      }));
  };
  
  // Transform admin sliders to match the format expected by UICarousel
  const processAdminSliders = () => {
    return adminSliders.map((slider, index) => ({
      key: slider._sys.filename || `admin-slide-${index}`,
      title: slider.title || '',
      src: slider.slider_image || '',
      excerpt: slider.excerpt || '',
      actions: slider.actions || [],
      affiliate_url: slider.affiliate_url || '',
    }));
  };
  
  // Get the appropriate slides based on configuration
  const slides = data.useAdminSliders ? processAdminSliders() : processInlineSlides();

  return (
    <Section color={data.color} className={data.fullWidth ? 'py-0' : ''}>
      <Container size={data.fullWidth ? 'full' : 'large'} className={data.fullWidth ? 'p-0' : ''} verticalPadding="custom" >
        {/* {data.headline && (
          <h3
            data-tina-field={tinaField(data, 'headline')}
            className={`w-full relative mb-10 text-5xl font-extrabold tracking-normal leading-tight title-font text-center`}
          >
            {data.headline}
          </h3>
        )} */}
        
        {/* {data.description && (
          <div
            data-tina-field={tinaField(data, 'description')}
            className="prose prose-lg mx-auto text-center max-w-2xl"
          >
            <TinaMarkdown content={data.description} />
          </div>
        )} */}
        
        <div 
          className={`w-full ${data.fullWidth ? 'mx-0 max-w-none' : ''}`}
        >
          {isLoading ? (
            <CarouselSkeleton message="" />
          ) : slides.length > 0 ? (
            <UICarousel 
              slides={slides as any} 
              autoPlay={data.autoPlay}
              showTitles={data.showTitles !== false}
            />
          ) : (
            <CarouselSkeleton message="" />
          )}
        </div>
        
      </Container>
    </Section>
  );
};

export const carouselBlockSchema: Template = {
  name: 'carousel',
  label: 'Carousel',
  ui: {
    previewSrc: '/blocks/carousel.png',
    defaultItem: {
      headline: 'Featured Sliders',
      fullWidth: true,
      useAdminSliders: false,
      autoPlay: false,
      showTitles: true,
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Headline',
      name: 'headline',
    },
    {
      type: 'rich-text',
      label: 'Description',
      name: 'description',
    },
    {
      type: 'boolean',
      label: 'Full Width',
      name: 'fullWidth',
      description: 'Display carousel in full width (like a hero)',
      ui: {
        defaultValue: true,
      }
    },
    {
      type: 'boolean',
      label: 'Auto Play',
      name: 'autoPlay',
      description: 'Enable automatic slide transitions',
      ui: {
        defaultValue: false,
      }
    },
    {
      type: 'boolean',
      label: 'Show Titles',
      name: 'showTitles',
      description: 'Show or hide slide titles',
      ui: {
        defaultValue: true,
      }
    },
    {
      type: 'boolean',
      label: 'Use Admin Sliders',
      name: 'useAdminSliders',
      description: 'Enable to use sliders created in the admin interface instead of inline slides',
    },
    {
      type: 'object',
      label: 'Slides',
      name: 'slides',
      list: true,
      description: 'These slides will be used only if "Use Admin Sliders" is disabled',
      ui: {
        itemProps: (item) => ({
          label: item?.title || 'Slide',
        }),
      },
      fields: [
        {
          type: 'string',
          label: 'Title',
          name: 'title',
        },
        {
          type: 'object',
          label: 'Image',
          name: 'image',
          fields: [
            {
              name: 'src',
              label: 'Image Source',
              type: 'image',
            },
            {
              name: 'alt',
              label: 'Alt Text',
              type: 'string',
            },
          ],
        },
        {
          type: 'rich-text',
          label: 'Text',
          name: 'text',
        },
        {
          type: 'string',
          label: 'Button Text',
          name: 'buttonText',
          ui: {
            defaultValue: 'View Details',
          },
        },
        {
          type: 'string',
          label: 'Button Link',
          name: 'buttonLink',
        },
        {
          type: 'datetime',
          label: 'Start Date',
          name: 'start_date',
          description: 'Slide will only be visible on or after this date (optional)',
        },
        {
          type: 'datetime',
          label: 'End Date',
          name: 'end_date',
          description: 'Slide will only be visible until this date (optional)',
        },
      ],
    },
    {
      type: 'string',
      label: 'Color',
      name: 'color',
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
  ],
}; 