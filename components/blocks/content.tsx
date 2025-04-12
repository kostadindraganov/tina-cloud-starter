"use client";
import React from "react";

import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { Template } from "tinacms";
import { PageBlocksContent } from "../../tina/__generated__/types";
import { tinaField } from "tinacms/dist/react";
import { Container } from "../layout/container";
import { Section } from "../layout/section";
import { mermaid } from "./mermaid";

export const Content = ({ data }: { data: PageBlocksContent }) => {
  return (
    <Section color={data.color || undefined}>
      <Container
        className={`${
          data.color === "primary" 
            ? `prose-primary` 
            : `prose-[hsl(var(--foreground))] dark:prose-dark`
        } transition-colors duration-300`}
        data-tina-field={tinaField(data, "body")}
        size={data.containerSize || "large"}
       
      >
        <TinaMarkdown 
          content={data.body}
          components={{
            mermaid: (props: { value: string }) => mermaid({ value: props.value }),
          }}
        />
      </Container>
    </Section>
  );
};

export const contentBlockSchema: Template = {
  name: "content",
  label: "Content",
  ui: {
    previewSrc: "/blocks/content.png",
    defaultItem: {
      body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.",
      containerSize: "large",
    },
  },
  fields: [
    {
      type: "rich-text",
      label: "Body",
      name: "body",
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" },
      ],
    },
    {
      type: "string",
      label: "Container Size",
      name: "containerSize",
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
        { label: "Full", value: "full" },
      ],
    },
  ],
};
