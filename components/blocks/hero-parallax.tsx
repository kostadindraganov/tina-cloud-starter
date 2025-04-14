"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Template } from 'tinacms';
import { tinaField } from "tinacms/dist/react";
import { Section } from "../layout/section";
import { Container } from "../layout/container";

export interface HeroParallaxItem {
  title: string;
  link: string;
  thumbnail: string;
}

export interface HeroParallaxProps {
  title?: string;
  subtitle?: string;
  products: HeroParallaxItem[];
}

export const HeroParallax = ({
  title = "The Ultimate development studio",
  subtitle = "We build beautiful products with the latest technologies and frameworks. We are a team of passionate developers and designers that love to build amazing products.",
  products,
}: HeroParallaxProps) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 100]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[200vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header title={title} subtitle={subtitle} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({ title, subtitle }: { title?: string; subtitle?: string }) => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
        {title?.split(' ').map((word, i, arr) => (
          <React.Fragment key={i}>
            {word}
            {i < arr.length - 1 && ' '}
            {i === 0 && <br />}
          </React.Fragment>
        ))}
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        {subtitle}
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: HeroParallaxItem;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};

// TinaCMS Block Component
export const HeroParallaxBlock = ({ data }: { data: any }) => {
  // Transform TinaCMS items to the format expected by HeroParallax
  const products = data.items?.map((item: any) => ({
    title: item.title,
    link: item.link || "#",
    thumbnail: item.thumbnail || "/images/placeholder.jpg",
  })) || [];

  return (
    <Section color={data.color}>
      <div data-tina-field={tinaField(data, "items")}>
        <HeroParallax
          title={data.title}
          subtitle={data.subtitle}
          products={products}
        />
      </div>
    </Section>
  );
};

export const heroParallaxBlockSchema: Template = {
  name: "heroParallax",
  label: "Hero Parallax",
  ui: {
    previewSrc: "/blocks/hero-parallax.png",
    defaultItem: {
      title: "The Ultimate",
      subtitle: "We build beautiful products with the latest technologies and frameworks. We are a team of passionate developers and designers that love to build amazing products.",
      items: [
        {
          title: "Project 1",
          link: "https://example.com",
          thumbnail: "/images/placeholder.jpg",
        },
        {
          title: "Project 2",
          link: "https://example.com",
          thumbnail: "/images/placeholder.jpg",
        },
        {
          title: "Project 3",
          link: "https://example.com",
          thumbnail: "/images/placeholder.jpg",
        },
      ],
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
      ui: {
        component: "textarea",
      },
    },
    {
      type: "object",
      label: "Items",
      name: "items",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title || "Item",
        }),
      },
      fields: [
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "string",
          label: "Link",
          name: "link",
        },
        {
          type: "image",
          label: "Thumbnail",
          name: "thumbnail",
        },
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
  ],
};
