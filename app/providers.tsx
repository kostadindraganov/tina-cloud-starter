'use client'

import React from 'react'
import { LayoutProvider } from '@/components/layout/layout-context'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { AnimationProvider } from '@/components/layout/animation-context'

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
      name: "Gamblementor",
      style: "default"
    },
    name: "Gamblementor",
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
  },
  theme: {
    __typename: "GlobalTheme" as const,
    color: "blue",
    font: "sans"
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
    <ThemeProvider>
      <LayoutProvider globalSettings={defaultGlobalData} pageData={defaultPageData}>
        <AnimationProvider>
          {children}
        </AnimationProvider>
      </LayoutProvider>
    </ThemeProvider>
  )
} 