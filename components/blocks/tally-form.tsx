'use client';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import Script from 'next/script';
import { Section } from '../layout/section';
import { Container } from '../layout/container';

export interface PageBlocksTallyForm {
  __typename: 'PageBlocksTallyForm';
  formUrl: string;
  alignLeft?: boolean;
  hideTitle?: boolean;
  transparentBackground?: boolean;
  dynamicHeight?: boolean;
  title?: string;
  subtitle?: string;
  color?: string;
  containerSize?: 'small' | 'medium' | 'large' | 'custom';
  htmlAlignLeft?: boolean;
  iframeHeight?: number;
  hideCustomTitle?: boolean;
  hideCustomSubtitle?: boolean;
}

export const TallyForm = ({ data }: { data: PageBlocksTallyForm }) => {
  const formUrl = data.formUrl || 'https://tally.so/embed/mOVYJa';
  const containerSize = data.containerSize || 'small';
  const htmlAlignLeft = data.htmlAlignLeft ?? false;
  const iframeHeight = data.iframeHeight || 200;
  const hideCustomTitle = data.hideCustomTitle ?? false;
  const hideCustomSubtitle = data.hideCustomSubtitle ?? false;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build the query parameters
  const queryParams = new URLSearchParams();
  queryParams.append('alignLeft', '1');  // Always set to 1
  queryParams.append('hideTitle', '1');  // Always set to 1
  queryParams.append('transparentBackground', '1');  // Always set to 1
  queryParams.append('dynamicHeight', '1');  // Always set to 1

  // Construct the full URL with query parameters
  const fullFormUrl = `${formUrl}?${queryParams.toString()}`;

  // Define text alignment classes
  const textAlignClass = htmlAlignLeft ? 'text-left' : 'text-center';
  const contentAlignClass = htmlAlignLeft ? 'mx-0' : 'mx-auto';

  useEffect(() => {
    // Load Tally script
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    script.onload = () => {
      // Cast window to any to access the Tally object
      const windowWithTally = window as any;
      if (windowWithTally.Tally) {
        windowWithTally.Tally.loadEmbeds();
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Section color={data.color}>
      <Container size={containerSize}>
        {data.title && !hideCustomTitle && (
          <h2
            data-tina-field={tinaField(data, 'title')}
            className={`text-3xl font-bold tracking-tight ${textAlignClass} mb-4`}
          >
            {data.title}
          </h2>
        )}
        {data.subtitle && !hideCustomSubtitle && (
          <p
            data-tina-field={tinaField(data, 'subtitle')}
            className={`text-lg ${textAlignClass} mb-8 max-w-xl ${contentAlignClass}`}
          >
            {data.subtitle}
          </p>
        )}
        <div 
          data-tina-field={tinaField(data, 'formUrl')} 
          className={htmlAlignLeft ? 'text-left' : ''}
        >
          <iframe
            ref={iframeRef}
            data-tally-src={fullFormUrl}
            loading="lazy"
            width="100%"
            height={iframeHeight}
          ></iframe>
        </div>
      </Container>
    </Section>
  );
};

export const tallyFormBlockSchema: Template = {
  name: 'tallyForm',
  label: 'Tally Form',
  ui: {
    previewSrc: '/blocks/tally-form.png',
    defaultItem: {
      formUrl: 'https://tally.so/embed/mOVYJa',
      title: 'Contact Us',
      subtitle: 'Fill out the form below and we\'ll get back to you as soon as possible.',
      containerSize: 'small',
      htmlAlignLeft: false,
      iframeHeight: 200,
      hideCustomTitle: false,
      hideCustomSubtitle: false,
    },
  },
  fields: [
    {
      type: 'string',
      label: 'Form URL',
      name: 'formUrl',
      description: 'The Tally.so embed URL (e.g., https://tally.so/embed/mOVYJa)',
      required: true,
    },
    {
      type: 'string',
      label: 'Title',
      name: 'title',
      description: 'The title displayed above the form',
    },
    {
      type: 'string',
      label: 'Subtitle',
      name: 'subtitle',
      description: 'The subtitle displayed below the title',
    },
    {
      type: 'boolean',
      label: 'Hide Custom Title',
      name: 'hideCustomTitle',
      description: 'Hide the custom title that appears above the form',
    },
    {
      type: 'boolean',
      label: 'Hide Custom Subtitle',
      name: 'hideCustomSubtitle',
      description: 'Hide the custom subtitle that appears below the title',
    },
    {
      type: 'string',
      label: 'Container Size',
      name: 'containerSize',
      description: 'The size of the container that holds the form',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      type: 'number',
      label: 'iFrame Height',
      name: 'iframeHeight',
      description: 'Height of the form iframe in pixels (default: 200). Only applies as a fallback if dynamic height fails.',
    },
    {
      type: 'boolean',
      label: 'HTML Align Left',
      name: 'htmlAlignLeft',
      description: 'Align the title, subtitle, and form container to the left',
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