'use client'

import { NuqsAdapter } from '@/lib/mock-nuqs'
import { PropsWithChildren } from 'react'
import StoreProvider from '@/store/provider'

export function Providers({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <StoreProvider>
        {children}
      </StoreProvider>
    </NuqsAdapter>
  )
} 