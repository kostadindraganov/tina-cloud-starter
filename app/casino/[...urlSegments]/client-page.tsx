"use client";
import React from "react";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { CasinoItemQueryQuery } from "@/tina/__generated__/types";
import MermaidElement from "@/components/mermaid-renderer";

interface ClientCasinoProps {
  data: CasinoItemQueryQuery;
  variables: { relativePath: string };
  query: string;
}

export default function CasinoClientPage(props: ClientCasinoProps) {
  const { data } = useTina({ ...props });
  const casino = data.casino;
  return (
    <div className="prose dark:prose-dark w-full max-w-none">
      <h1>{casino.title}</h1>

      <TinaMarkdown
        content={casino._body}
        components={{
          mermaid({ value }: { value: string }) {
            return <MermaidElement value={value} />;
          }
        }}
      />
    </div>
  );
}
