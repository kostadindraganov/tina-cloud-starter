'use client';
import * as React from 'react';
import dynamic from 'next/dynamic';
import type { Template } from 'tinacms';
import { PageBlocksVideo } from '@/tina/__generated__/types';
import { Section } from '../layout/section';
import { Container } from '../layout/container';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export const Video = ({ data }: { data: PageBlocksVideo }) => {
  if (!data.url) {
    return null;
  }
  return (
    <Section color={data.color}>
      <Container size='large'>
        <div className='aspect-video'>
          <ReactPlayer width='100%' height='100%' style={{ margin: 'auto' }} playing={!!data.autoPlay} loop={!!data.loop} controls={true} url={data.url} />
        </div>
      </Container>
    </Section>
  );
};

export const videoBlockSchema: Template = {
  name: 'video',
  label: 'Video',
  ui: {
    previewSrc: '/blocks/video.png',
    defaultItem: {
      url: 'https://www.youtube.com/watch?v=j8egYW7Jpgk',
    },
  },
  fields: [
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
      type: 'string',
      label: 'Url',
      name: 'url',
    },
    {
      type: 'boolean',
      label: 'Auto Play',
      name: 'autoPlay',
    },
    {
      type: 'boolean',
      label: 'Loop',
      name: 'loop',
    },
  ],
};
