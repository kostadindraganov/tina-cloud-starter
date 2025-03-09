'use client'

import { NuqsAdapter } from '@/lib/mock-nuqs'
import { PropsWithChildren } from 'react'

export function Providers({ children }: PropsWithChildren) {
  return <NuqsAdapter>{children}</NuqsAdapter>
} 