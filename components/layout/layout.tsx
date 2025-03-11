import React, { PropsWithChildren } from "react";
import { LayoutProvider } from "./layout-context";
import client from "../../tina/__generated__/client";
import Header from "../nav/header";
import Footer from "../nav/footer";
import { cn } from "../../lib/utils";

type LayoutProps = PropsWithChildren & {
  rawPageData?: any;
};

export default async function Layout({ children, rawPageData }: LayoutProps) {
  const { data: globalData } = await client.queries.global({
    relativePath: "index.json",
  });

  return (
    <LayoutProvider globalSettings={globalData.global} pageData={rawPageData}>
      <Header />
      <main
        className={cn(
          "font-sans flex-1 text-[hsl(var(--foreground))] bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--background)/0.8)] flex flex-col transition-colors duration-300"
        )}
      >
        {children}
      </main>
      <Footer />
    </LayoutProvider>
  );
}
