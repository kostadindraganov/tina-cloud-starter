"use client";
import React from "react";
import Image from "next/image";
import { useTina } from "tinacms/dist/react";
import { SlidersQuery } from "@/tina/__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";

export interface ClientSliderPageProps {
  data: {
    sliders: SlidersQuery["sliders"];
  };
  variables: {
    relativePath: string;
  };
  query: string;
}

export default function ClientSliderPage(props: ClientSliderPageProps) {
  const { data } = useTina(props);
  const slider = data.sliders;

  if (!slider) {
    return <div>Slider not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{slider.title}</h1>
      {slider.slider_image && (
        <div className="mb-6 relative w-full h-64 md:h-96">
          <Image 
            src={slider.slider_image}
            alt={slider.title || "Slider"}
            fill
            className="object-contain"
          />
        </div>
      )}
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold mt-4">Slider Details</h2>
        <ul className="mt-2">
          <li><strong>Affiliate URL:</strong> {slider.affiliate_url || "None"}</li>
          <li><strong>Internal URL:</strong> {slider.internal_url || "None"}</li>
          <li><strong>Start Date:</strong> {slider.start_date ? new Date(slider.start_date).toLocaleDateString() : "Not set"}</li>
          <li><strong>End Date:</strong> {slider.end_date ? new Date(slider.end_date).toLocaleDateString() : "Not set"}</li>
        </ul>
        {slider.excerpt && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Excerpt</h3>
            <div className="mt-2">
              <TinaMarkdown content={slider.excerpt} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 