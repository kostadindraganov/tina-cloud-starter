"use client"

import { Casino } from "@/store"
import { CasinoCard } from "./casino-card"

interface CasinoDetailProps {
  casino: Casino
}

export function CasinoDetail({ casino }: CasinoDetailProps) {
  if (!casino) return null
  
  return (
    <div className="container mx-auto px-4 py-8">
      <CasinoCard casino={casino} />
    </div>
  )
} 