'use client'

import React from 'react'
import { ThemeProvider } from 'next-themes'
import { LayoutProvider } from '@/components/layout/layout-context'

const defaultGlobalData = {
  __typename: "Global" as const,
  id: "content/global/index.json",
  _sys: {
    __typename: "SystemInfo" as const,
    filename: "index.json",
    basename: "index",
    hasReferences: false,
    breadcrumbs: [],
    path: "content/global/index.json",
    relativePath: "index.json",
    extension: ".json",
  },
  header: {
    __typename: "GlobalHeader" as const,
    icon: {
      __typename: "GlobalHeaderIcon" as const,
      color: "blue",
      name: "Tina",
      style: "default"
    },
    name: "Tina Starter",
    color: "blue",
    nav: []
  },
  footer: {
    __typename: "GlobalFooter" as const,
    color: "blue",
    social: {
      __typename: "GlobalFooterSocial" as const,
      facebook: "",
      twitter: "",
      instagram: "",
      github: ""
    }
  }
};

const defaultPageData = {
  __typename: "Page" as const,
  id: "",
  _sys: {
    __typename: "SystemInfo" as const,
    filename: "",
    basename: "",
    breadcrumbs: [],
    path: "",
    relativePath: "",
    extension: "",
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LayoutProvider globalSettings={defaultGlobalData} pageData={defaultPageData}>
        {children}
      </LayoutProvider>
    </ThemeProvider>
  )
} 