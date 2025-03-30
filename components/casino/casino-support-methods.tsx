"use client"

import React from "react"
import { BiSupport } from "react-icons/bi"
import { MdEmail, MdPhone, MdAccessTime, MdChat } from "react-icons/md"
import { cn } from "@/lib/utils"

interface LiveChat {
  __typename: 'CasinoCustomer_support_methodsLive_chat'
  live_chat_url?: string | null
}

interface Email {
  __typename: 'CasinoCustomer_support_methodsEmail'
  email?: string | null
}

interface Phone {
  __typename: 'CasinoCustomer_support_methodsPhone'
  phone?: string | null
}

interface SupportAvailability {
  __typename: 'CasinoCustomer_support_methodsSupport_availability'
  support_availability?: string | null
}

type SupportMethod = LiveChat | Email | Phone | SupportAvailability | null

interface CasinoSupportMethodsProps {
  supportMethods?: SupportMethod[] | null
  className?: string
}

export function CasinoSupportMethods({ supportMethods, className }: CasinoSupportMethodsProps) {
  // Return early if no support methods data is available
  if (!supportMethods || supportMethods.length === 0) {
    return (
      <div className={cn("text-center p-3 bg-white dark:bg-gray-800 rounded-md", className)}>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No customer support information available</p>
      </div>
    )
  }

  // Extract different support methods
  const liveChat = supportMethods.find(method => method?.__typename === 'CasinoCustomer_support_methodsLive_chat') as LiveChat | undefined
  const email = supportMethods.find(method => method?.__typename === 'CasinoCustomer_support_methodsEmail') as Email | undefined
  const phone = supportMethods.find(method => method?.__typename === 'CasinoCustomer_support_methodsPhone') as Phone | undefined
  const availability = supportMethods.find(method => method?.__typename === 'CasinoCustomer_support_methodsSupport_availability') as SupportAvailability | undefined

  return (
    <div className={cn("rounded-md", className)}>
      <div className="p-3 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {liveChat && liveChat.live_chat_url && (
            <a 
              href={liveChat.live_chat_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all no-underline"
            >
              <MdChat className="text-gray-500 dark:text-gray-400 text-lg" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Live Chat</span>
            </a>
          )}

          {email && email.email && (
            <a 
              href={`mailto:${email.email}`}
              className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all no-underline"
            >
              <MdEmail className="text-gray-500 dark:text-gray-400 text-lg" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{email.email}</span>
            </a>
          )}
          
          {phone && phone.phone && (
            <a 
              href={`tel:${phone.phone}`} 
              className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all no-underline"
            >
              <MdPhone className="text-gray-500 dark:text-gray-400 text-lg" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{phone.phone}</span>
            </a>
          )}
        </div>
        {availability && availability.support_availability && (
            <div className="flex items-center gap-2 p-2 mt-4 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
              <MdAccessTime className="text-gray-500 dark:text-gray-400 text-lg" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{availability.support_availability}</span>
            </div>
          )}
      </div>
    </div>
  )
} 