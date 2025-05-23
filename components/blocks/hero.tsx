'use client';
import * as React from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import type { Template } from 'tinacms';
import { PageBlocksHero } from '../../tina/__generated__/types';
import { tinaField } from 'tinacms/dist/react';
import Image from 'next/image';
import { Section } from '../layout/section';
import { Container } from '../layout/container';
import { Actions } from './actions';
import { mermaid } from './mermaid';
import { AnimatedTitle } from "../ui/animated-title";

export const Hero = ({ data }: { data: PageBlocksHero & { animatedTitle?: boolean } }) => {
  const headlineColorClasses = {
    blue: 'from-blue-400 to-blue-600',
    teal: 'from-teal-400 to-teal-600',
    green: 'from-green-400 to-green-600',
    red: 'from-red-400 to-red-600',
    pink: 'from-pink-400 to-pink-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-300 to-orange-600',
    yellow: 'from-yellow-400 to-yellow-600',
  };

  return (
    <Section color={data.color}>
      <Container size='large' className='grid grid-cols-1 md:grid-cols-5 gap-14 items-start justify-center'>
        <div className='row-start-2 md:row-start-1 md:col-span-5 text-center md:text-left'>
          <div className={`w-full lg:w-1/2 lg:pr-12`}>
            <div>
              {data.tagline && (
                <div className='relative inline-block px-3 py-1 mb-8 text-md font-bold tracking-wide title-font z-20'>
                  <AnimatedTitle 
                    as="h2" 
                    className="relative z-20"
                    animated={data.animatedTitle}
                  >
                    {data.tagline}
                  </AnimatedTitle>
                  <span className='absolute w-full h-full left-0 top-0 rounded-full -z-1 bg-current opacity-7'></span>
                </div>
              )}

              {data.headline && (
                <AnimatedTitle 
                  as="h3" 
                  className={`w-full relative text-4xl md:text-5xl font-bold tracking-normal text-center lg:text-left title-font mb-8 z-20 ${
                    data.color === 'primary' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}
                  data-tina-field={tinaField(data, 'headline')}
                  animated={data.animatedTitle}
                >
                  {data.headline}
                </AnimatedTitle>
              )}
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-6'>
            <div className='flex flex-col md:w-3/5'>
              {data.text && (
                <div
                  data-tina-field={tinaField(data, 'text')}
                  className={`prose prose-lg mx-auto md:mx-0 mb-10 ${data.color === 'primary' ? `prose-primary` : `dark:prose-dark`}`}
                >
                  <TinaMarkdown
                    content={data.text}
                    components={{
                      mermaid,
                    }}
                  />
                </div>
              )}
            </div>
            {data.image?.src && (
              <div data-tina-field={tinaField(data.image, 'src')} className='relative flex-shrink-0 md:w-2/5 flex justify-center'>
                <Image
                  className='w-full h-auto max-w-full rounded-lg'
                  style={{ objectFit: 'cover' }}
                  alt={data.image.alt || ''}
                  src={data.image.src}
                  width={500}
                  height={500}
                  priority={true}
                />
              </div>
            )}
          </div>
          {data.text2 && (
            <div
              data-tina-field={tinaField(data, 'text2')}
              className={`prose prose-lg mx-auto md:mx-0 mb-10 ${data.color === 'primary' ? `prose-primary` : `dark:prose-dark`}`}
            >
              <TinaMarkdown
                content={data.text2}
                components={{
                  mermaid,
                }}
              />
            </div>
          )}
          {data.actions && (
            <div className='mt-10'>
              <Actions className='justify-center md:justify-start py-2' parentColor={data.color!} actions={data.actions.map((x) => x!)} />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

export const heroBlockSchema: Template = {
  name: 'hero',
  label: 'Hero',
  ui: {
    previewSrc: '/blocks/hero.png',
    defaultItem: {
      tagline: "Here's some text above the other text",
      headline: 'This Big Text is Totally Awesome',
      text: 'Phasellus scelerisque, libero eu finibus rutrum, risus risus accumsan libero, nec molestie urna dui a leo.',
      animatedTitle: false
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
      label: 'Text-1',
      name: 'text',
      type: 'rich-text',
    },
    {
      type: 'rich-text',
      label: 'Text-2',
      name: 'text2',
    },
    {
      label: 'Actions',
      name: 'actions',
      type: 'object',
      list: true,
      ui: {
        defaultItem: {
          label: 'Action Label',
          type: 'button',
          icon: true,
          link: '/',
        },
        itemProps: (item) => ({ label: item.label }),
      },
      fields: [
        {
          label: 'Label',
          name: 'label',
          type: 'string',
        },
        {
          label: 'Type',
          name: 'type',
          type: 'string',
          options: [
            { label: 'Button', value: 'button' },
            { label: 'Link', value: 'link' },
          ],
        },
        {
          label: 'Icon',
          name: 'icon',
          type: 'boolean',
        },
        {
          label: 'Link',
          name: 'link',
          type: 'string',
        },
      ],
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
    {
      type: "boolean",
      label: "Animated Title",
      name: "animatedTitle",
      description: "Enable gradient animation effect on title and headline"
    },
  ],
};
