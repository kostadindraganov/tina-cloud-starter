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
      className="mx-auto prose"
   data-tina-field={tinaField(data, 'body')}
        size={data.containerSize || "small"}
       
      >  

<div
                  data-tina-field={tinaField(data, 'body')}
                  className={` prose-lg mx-auto md:mx-0 mb-10 ${data.color === 'primary' ? `prose-primary` : `dark:prose-dark`}`}
                >
                  <TinaMarkdown
                    content={data.body}
                    components={{
                      mermaid,
                    }}
                  />
                </div>
        
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
