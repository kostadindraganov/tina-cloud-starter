"use client";
import React from "react";
import Image from "next/image";
import { useTina } from "tinacms/dist/react";
import { BannersQuery } from "@/tina/__generated__/types";

export interface ClientBannerPageProps {
  data: {
    banners: BannersQuery["banners"];
  };
  variables: {
    relativePath: string;
  };
  query: string;
}

export default function ClientBannerPage(props: ClientBannerPageProps) {
  const { data } = useTina(props);
  const banner = data.banners;

  if (!banner) {
    return <div>Banner not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{banner.title}</h1>
      {banner.banner_image && (
        <div className="mb-6 relative w-full h-64 md:h-96">
          <Image 
            src={banner.banner_image}
            alt={banner.title || "Banner"}
            fill
            className="object-contain"
          />
        </div>
      )}
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold mt-4">Banner Details</h2>
        <ul className="mt-2">
          <li><strong>Position:</strong> {banner.position?.join(", ") || "Not specified"}</li>
          <li><strong>Affiliate URL:</strong> {banner.affiliate_url || "None"}</li>
          <li><strong>Start Date:</strong> {banner.start_date ? new Date(banner.start_date).toLocaleDateString() : "Not set"}</li>
          <li><strong>End Date:</strong> {banner.end_date ? new Date(banner.end_date).toLocaleDateString() : "Not set"}</li>
        </ul>
      </div>
    </div>
  );
} 