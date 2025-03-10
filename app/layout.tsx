import React from "react";
import { Metadata } from "next";
import { Inter as FontSans, Lato, Nunito } from "next/font/google";
import { cn } from "@/lib/utils";
import client from "@/tina/__generated__/client";

import "@/styles.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeNavigation } from "@/components/ui/theme-navigation";
import { Providers } from "./providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Tina",
  description: "Tina Cloud Starter",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalQuery = await client.queries.global({
    relativePath: "index.json",
  });
  const global = globalQuery.data.global;

  const selectFont = (fontName: string) => {
    switch (fontName) {
      case "nunito":
        return `font-nunito ${nunito.variable}`;
      case "lato":
        return `font-lato ${lato.variable}`;
      case "sans":
      default:
        return `font-sans ${fontSans.variable} `;
    }
  };
  const fontVariable = selectFont(global?.theme?.font || "sans");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* these are also defined in next.config.js but github pages doesn't support response headers */}
        {/* if you aren't deploying to github pages, feel free to delete these tags */}
        <meta name="X-Frame-Options" content="SAMEORIGIN" />
        <meta name="Content-Security-Policy" content="frame-ancestors 'self'" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased",
          fontVariable
        )}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <ThemeNavigation />
              <main className="flex-1">
                {children}
              </main>
              <footer className="py-6 border-t border-[hsl(var(--border))]">
                <div className="layout-container">
                  <div className="text-center text-sm text-[hsl(var(--muted-foreground))]">
                    © {new Date().getFullYear()} TinaApp. All rights reserved.
                  </div>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
