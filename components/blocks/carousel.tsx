'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { Container } from '../layout/container';
import { Carousel as UICarousel } from '../ui/carousel';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface SliderItem {
  title?: string;
  image?: { src?: string; alt?: string };
  text?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface TinaSlider {
  _sys: {
    filename: string;
  };
  title: string;
  slider_image: string;
  affiliate_url?: string;
  internal_url?: string;
  excerpt?: any;
  start_date?: string;
  end_date?: string;
}

interface CarouselBlockData {
  headline?: string;
  description?: any;
  slides?: SliderItem[];
  useAdminSliders?: boolean;
  color?: string;
  fullWidth?: boolean;
}

export const Carousel = ({ data }: { data: CarouselBlockData }) => {
  const [adminSliders, setAdminSliders] = useState<TinaSlider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch sliders from API if useAdminSliders is enabled
  useEffect(() => {
    const fetchSliders = async () => {
      if (!data.useAdminSliders) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/sliders');
        if (!response.ok) throw new Error('Failed to fetch sliders');
        
        const data = await response.json();
        setAdminSliders(data.sliders);
      } catch (error) {
        console.error('Error fetching sliders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSliders();
  }, [data.useAdminSliders]);

  // Transform our slider data to match what the Carousel component expects
  const slides = React.useMemo(() => {
    // If using admin sliders and we have fetched them
    if (data.useAdminSliders && adminSliders.length > 0) {
      return adminSliders.map(slider => {
        // Filter out sliders with expired dates
        const now = new Date();
        const startDate = slider.start_date ? new Date(slider.start_date) : new Date(0);
        const endDate = slider.end_date ? new Date(slider.end_date) : new Date(8640000000000000); // Max date
        
        if (startDate > now || now > endDate) return null;
        
        return {
          title: slider.title || '',
          button: 'Read More',
          src: slider.slider_image || '',
          url: slider.affiliate_url || slider.internal_url || '#',
        };
      }).filter(Boolean);
    }
    
    // Otherwise use the slides defined in the block
    return data.slides?.map((slide) => {
      if (!slide) return null;
      
      return {
        title: slide.title || '',
        button: slide.buttonText || 'Read More',
        src: slide.image?.src || '',
        url: slide.buttonLink || '#',
      };
    }).filter(Boolean) || [];
  }, [data.slides, data.useAdminSliders, adminSliders]);

  return (
    <Section color={data.color} className={data.fullWidth ? 'py-0' : ''}>
      <Container size={data.fullWidth ? 'full' : 'large'} className={data.fullWidth ? 'p-0' : ''} verticalPadding="custom" widthClass="large">
        {data.headline && (
          <h3
            data-tina-field={tinaField(data, 'headline')}
            className={`w-full relative mb-10 text-5xl font-extrabold tracking-normal leading-tight title-font text-center`}
          >
            {data.headline}
          </h3>
        )}
        
        {data.description && (
          <div
            data-tina-field={tinaField(data, 'description')}
            className="prose prose-lg mx-auto text-center max-w-2xl"
          >
            <TinaMarkdown content={data.description} />
          </div>
        )}
        
        <div 
          className={`w-full ${data.fullWidth ? 'mx-0 max-w-none' : ''}`}
        >
          {isLoading ? (
            <div className="w-full h-[500px] bg-gray-100 animate-pulse flex items-center justify-center">
              <span className="text-gray-500">Loading sliders...</span>
            </div>
          ) : slides.length > 0 ? (
            <UICarousel slides={slides as any} />
          ) : (
            <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">No sliders available</span>
            </div>
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
      ],
    },
    {
      type: 'string',
      label: 'Color',
      name: 'color',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Tint', value: 'tint' },
        { label: 'Primary', value: 'primary' },
      ],
    },
  ],
}; 