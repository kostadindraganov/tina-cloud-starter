'use client';
import * as React from 'react';
import { Section } from '../layout/section';
import { Container } from '../layout/container';
import { LogosSlider } from '../ui/logos-slider';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';

export type LogoItem = {
  id: string;
  image: string;
  description: string;
  url?: string;
  className?: string;
}

export type LogosSliderBlockProps = {
  headline?: string;
  tagline?: string;
  color?: 'default' | 'tint' | 'primary';
  logos?: LogoItem[];
};

export const LogosSliderBlock = ({ data }: { data: LogosSliderBlockProps }) => {
  // Ensure all logo IDs are strings and handle the case when logos might be undefined
  const processedLogos = React.useMemo(() => {
    if (!data.logos) return [];
    
    return data.logos.map(logo => ({
      ...logo,
      id: String(logo.id)
    }));
  }, [data.logos]);

  return (
    <Section color={data.color}>
      <Container size='large'>
        {data.tagline && (
          <h2 
            data-tina-field={tinaField(data, 'tagline')} 
            className='relative inline-block px-3 py-1 mb-8 text-md font-bold tracking-wide title-font z-20 text-center mx-auto'
          >
            {data.tagline}
            <span className='absolute w-full h-full left-0 top-0 rounded-full -z-1 bg-current opacity-7'></span>
          </h2>
        )}
        {data.headline && (
          <h3
            data-tina-field={tinaField(data, 'headline')}
            className='w-full relative mb-10 text-3xl font-bold tracking-normal leading-tight title-font text-left text-gray-350'
          >
            {data.headline}
          </h3>
        )}
        <LogosSlider logos={processedLogos} />
      </Container>
    </Section>
  );
};

export const logosSliderBlockSchema: Template = {
  name: 'logosSlider',
  label: 'Logos Slider',
  ui: {
    previewSrc: '/blocks/logos-slider.png',
    defaultItem: {
      tagline: 'Our Technology Stack',
      headline: 'Powered by the best tools in the industry',
      color: 'default',
      logos: [
        {
          id: 'logo-1',
          description: 'NextJS',
          image: 'https://www.shadcnblocks.com/images/block/logos/nextjs.svg',
          className: 'h-20 w-auto',
        },
        {
          id: 'logo-2',
          description: 'React',
          image: 'https://www.shadcnblocks.com/images/block/logos/react.svg',
          className: 'h-20 w-auto',
        },
      ],
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Tagline',
      name: 'tagline',
    },
    {
      type: 'string',
      label: 'Headline',
      name: 'headline',
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
    {
      type: 'object',
      label: 'Logos',
      name: 'logos',
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.description || 'Logo' }
        },
        defaultItem: {
          id: `logo-${Math.random().toString(36).substr(2, 9)}`,
          description: 'Logo',
          image: '',
          className: 'h-20 w-auto',
        },
      },
      fields: [
        {
          type: 'string',
          label: 'ID',
          name: 'id',
          ui: {
            parse: (value) => String(value),
          },
        },
        {
          type: 'string',
          label: 'Description',
          name: 'description',
        },
        {
          type: 'image',
          label: 'Logo Image',
          name: 'image',
        },
        {
          type: 'string',
          label: 'URL (optional)',
          name: 'url',
        },
        {
          type: 'string',
          label: 'CSS Class Name',
          name: 'className',
        },
      ],
    },
  ],
}; 