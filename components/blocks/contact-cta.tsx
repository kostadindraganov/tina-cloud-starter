'use client';
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import type { Template } from 'tinacms';
import { Section } from '../layout/section';
import { Container } from '../layout/container';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

// Define the type for our component props
export interface ContactCtaBlockProps {
  headline?: string;
  text?: any;
  buttonLabel?: string;
  tallyCode?: string;
  color?: string;
}

// SVG component for envelope
const EnvelopeSvg = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  
  return (
    <motion.div 
      ref={ref}
      initial={{ y: 120, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 120, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-[150px] h-auto"
    >
      <svg className="w-full h-auto" viewBox="0 0 303 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2922_20214)">
          <path d="M232.404 49.6415L16.6218 79.9516C10.7183 80.7809 6.60289 86.2249 7.4297 92.1111L27.8868 237.748C28.7136 243.634 34.1696 247.734 40.0731 246.904L255.855 216.594C261.759 215.765 265.874 210.321 265.048 204.435L244.591 58.7979C243.764 52.9117 238.308 48.8122 232.404 49.6415Z" fill="#F9C82B"></path>
          <g style={{ mixBlendMode: 'screen' }} opacity="0.5">
            <path d="M252.979 185.419L143.737 134.771C140.745 133.385 137.414 132.892 134.145 133.351C130.877 133.81 127.81 135.202 125.316 137.359L34.2659 216.122C31.6874 218.346 29.7088 221.179 28.5109 224.362C27.3129 227.545 26.9339 230.975 27.4084 234.341L27.6989 236.408C28.0959 239.235 29.6029 241.787 31.8883 243.505C34.1736 245.222 37.0502 245.963 39.8852 245.565L255.668 215.254C258.502 214.856 261.064 213.351 262.787 211.071C264.511 208.791 265.257 205.922 264.86 203.095L264.569 201.027C264.098 197.667 262.79 194.478 260.766 191.752C258.742 189.026 256.065 186.848 252.979 185.419Z" fill="#E5C93E"></path>
          </g>
          <path d="M253.167 186.759L143.942 136.129C140.95 134.743 137.618 134.249 134.35 134.708C131.081 135.167 128.015 136.559 125.52 138.716L34.4705 217.479C31.8916 219.7 29.9114 222.53 28.7106 225.709C27.5098 228.889 27.1266 232.317 27.5962 235.681L27.8866 237.749C28.2837 240.575 29.7907 243.128 32.076 244.845C34.3614 246.562 37.238 247.303 40.0729 246.905L255.855 216.595C258.69 216.197 261.251 214.692 262.975 212.412C264.699 210.131 265.444 207.262 265.047 204.436L264.757 202.368C264.286 199.007 262.978 195.819 260.954 193.092C258.93 190.366 256.253 188.189 253.167 186.759Z" fill="url(#paint0_linear_2922_20214)"></path>
          <g style={{ mixBlendMode: 'multiply' }} opacity="0.3">
            <path d="M8.90041 102.58C9.37258 105.94 10.6804 109.128 12.7046 111.855C14.7289 114.581 17.4053 116.758 20.4902 118.188L128.625 161.057C131.618 162.444 134.949 162.937 138.217 162.478C141.486 162.019 144.552 160.627 147.047 158.47L239.187 87.4688C241.758 85.2441 243.731 82.4136 244.926 79.2353C246.121 76.0569 246.5 72.6316 246.028 69.2713L244.531 58.6134L7.40332 91.9219L8.90041 102.58Z" fill="#FFE550"></path>
          </g>
          <path d="M7.42904 92.1064C7.90038 95.4669 9.20783 98.6557 11.2322 101.382C13.2566 104.108 15.9334 106.285 19.0188 107.715L128.244 158.345C131.236 159.732 134.568 160.225 137.836 159.766C141.105 159.307 144.171 157.915 146.666 155.758L237.716 76.9953C240.288 74.7711 242.261 71.9408 243.456 68.7623C244.651 65.5838 245.029 62.1582 244.557 58.7979C244.159 55.9722 242.651 53.4208 240.366 51.7046C238.081 49.9884 235.205 49.248 232.371 49.6461L16.6218 79.9516C13.7877 80.3497 11.2272 81.8538 9.50334 84.1331C7.77947 86.4124 7.03336 89.2804 7.42904 92.1064Z" fill="url(#paint1_linear_2922_20214)"></path>
          <g style={{ mixBlendMode: 'screen' }}>
            <path d="M16.7594 80.9313L232.542 50.6211C235.31 50.233 238.12 50.9319 240.38 52.5702C242.64 54.2086 244.173 56.6585 244.656 59.4034C244.628 59.2009 244.599 58.9984 244.571 58.7959C244.173 55.9702 242.665 53.4188 240.38 51.7026C238.095 49.9864 235.219 49.246 232.385 49.6441L16.6218 79.9516C13.7877 80.3497 11.2272 81.8538 9.50334 84.1331C7.77947 86.4124 7.03336 89.2804 7.42904 92.1064C7.45749 92.3089 7.48594 92.5114 7.51438 92.7139C7.22207 89.9388 8.02309 87.1583 9.74822 84.9596C11.4733 82.761 13.9875 81.3165 16.7594 80.9313Z" fill="#E5C93E"></path>
          </g>
          <g>
            <path d="M271.344 74.6242C285.568 55.8083 281.812 29.0688 262.954 14.8998C244.097 0.73078 217.279 4.49782 203.055 23.3137C188.831 42.1295 192.587 68.8691 211.444 83.0381C230.302 97.2071 257.12 93.4401 271.344 74.6242Z" style={{ fill: 'rgb(68, 175, 53)' }}></path>
          </g>
          <g style={{ mixBlendMode: 'multiply' }} opacity="0.3">
            <path d="M231.266 6.73079C230.846 6.78984 230.435 6.84756 230.024 6.93892C238.23 6.05982 246.503 7.80188 253.649 11.914C260.795 16.0261 266.445 22.2957 269.784 29.8192C273.124 37.3427 273.981 45.7312 272.231 53.7756C270.482 61.82 266.216 69.1047 260.049 74.5794C253.883 80.0542 246.133 83.4363 237.919 84.238C229.704 85.0399 221.449 83.22 214.342 79.0407C207.235 74.8615 201.645 68.5389 198.377 60.9843C195.108 53.4296 194.331 45.0333 196.157 37.0057C193.562 45.8424 193.904 55.2769 197.132 63.899C200.36 72.5212 206.299 79.8681 214.064 84.8417C221.828 89.8154 231 92.1488 240.208 91.4931C249.417 90.8375 258.168 87.2281 265.154 81.2042C272.14 75.1804 276.985 67.0657 278.965 58.0727C280.946 49.0798 279.956 39.6915 276.142 31.311C272.329 22.9305 265.897 16.0077 257.808 11.5773C249.72 7.14685 240.408 5.44666 231.266 6.73079Z" fill="#FC2A1F"></path>
          </g>
          <path d="M243.514 66.7689L236.689 67.7277L231.645 31.8165L224.399 32.8343L223.561 26.8672L237.632 24.8907L243.514 66.7689Z" fill="white"></path>
        </g>
        <ellipse cx="156" cy="276.85" rx="130" ry="7.15039" fill="url(#paint2_radial_2922_20214)"></ellipse>
        <defs>
          <linearGradient id="paint0_linear_2922_20214" x1="136.282" y1="148.601" x2="154.493" y2="278.244" gradientUnits="userSpaceOnUse">
            <stop offset="0.44" stopColor="#F6BF20"></stop>
            <stop offset="0.67" stopColor="#F6AB0E"></stop>
          </linearGradient>
          <linearGradient id="paint1_linear_2922_20214" x1="121.89" y1="46.1372" x2="139.202" y2="169.389" gradientUnits="userSpaceOnUse">
            <stop offset="0.13" stopColor="#FFF457"></stop>
            <stop offset="0.33" stopColor="#FFDF43"></stop>
            <stop offset="0.88" stopColor="#FFD231"></stop>
          </linearGradient>
          <radialGradient id="paint2_radial_2922_20214" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(156 276.85) rotate(90) scale(7.15039 130)">
            <stop stopColor="#161616"></stop>
            <stop offset="1" stopColor="#161616" stopOpacity="0"></stop>
          </radialGradient>
          <clipPath id="clip0_2922_20214">
            <rect width="276.303" height="211.238" fill="white" transform="translate(0 39.2188) rotate(-7.99582)"></rect>
          </clipPath>
        </defs>
      </svg>
    </motion.div>
  );
};

export const ContactCta = ({ data }: { data: ContactCtaBlockProps }) => {
  const cardRef = React.useRef(null);
  const headlineRef = React.useRef(null);
  const textRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  
  const isCardInView = useInView(cardRef, { once: true, margin: "-100px 0px" });
  const isHeadlineInView = useInView(headlineRef, { once: true, margin: "-100px 0px" });
  const isTextInView = useInView(textRef, { once: true, margin: "-100px 0px" });
  const isButtonInView = useInView(buttonRef, { once: true, margin: "-100px 0px" });

  return (
    <Section color={data.color}>
      <Container size="large" className="py-8 mt-24">
        <div className="flex justify-center items-center mx-auto relative">
          <motion.div 
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isCardInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-between flex-col lg:flex-row w-full lg:py-10 lg:px-20 p-10 rounded-2xl bg-green-600"
          >
            <div className="absolute -top-24 flex-shrink-0 lg:mr-10 mb-8 lg:mb-0">
              <EnvelopeSvg />
            </div>
            <div className="block text-center mb-5 lg:text-left lg:mb-0">
              {data.headline && (
                <motion.h2
                  ref={headlineRef}
                  initial={{ x: -50, opacity: 0 }}
                  animate={isHeadlineInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  data-tina-field={tinaField(data, 'headline')}
                  className="font-manrope text-xl md:text-4xl text-white font-semibold mb-5 lg:mb-2"
                >
                  {data.headline}
                </motion.h2>
              )}
              {data.text && (
                <motion.div 
                  ref={textRef}
                  initial={{ x: -50, opacity: 0 }}
                  animate={isTextInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                  data-tina-field={tinaField(data, 'text')} 
                  className="text-xl text-white"
                >
                  <TinaMarkdown content={data.text} />
                </motion.div>
              )}
            </div>
            {data.buttonLabel && (
              <motion.button
                ref={buttonRef}
                initial={{ y: 30, opacity: 0 }}
                animate={isButtonInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.68 }}
                data-tally-open={data.tallyCode} 
                data-tally-emoji-text="👋" 
                data-tally-emoji-animation="wave"
                className='group inline-flex items-center gap-2 bg-white hover:bg-green-700 text-green-500 hover:text-white px-6 py-3 rounded-full border-2 hover:border-white text-lg font-bold transition-all duration-100 hover:shadow-md md:text-2xl'
              >
                <span>{data.buttonLabel}</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export const contactCtaBlockSchema: Template = {
  name: 'contactCta',
  label: 'Subscribe',
  ui: {
    previewSrc: '/blocks/contact-cta.png',
    defaultItem: {
      headline: 'Connect with us',
      text: 'Contact us with any query or any idea.',
      buttonLabel: 'Get In Touch',
      buttonLink: '#',
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
      label: 'Text',
      name: 'text',
    },
    {
      type: 'string',
      label: 'Button Label',
      name: 'buttonLabel',
    },
    {
      type: 'string',
      label: 'tally code',
      name: 'tallyCode',
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