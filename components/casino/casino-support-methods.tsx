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
      <div className={cn("text-center p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm", className)}>
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
    <div className={cn("rounded-md shadow-sm overflow-hidden", className)}>
      {/* Support Methods Header */}
      <div className="bg-purple-600 dark:bg-purple-700 p-3 rounded-lg flex items-center justify-between border-b border-purple-500 dark:border-purple-600">
        <div className="flex items-center justify-center space-x-2">
          <BiSupport className="text-white dark:text-white text-lg" />
          <p className="font-medium p-0 text-sm text-white dark:text-white m-2">Customer Support</p>
        </div>
        <span className="text-white dark:text-white text-xs font-medium">
          {supportMethods.length} Methods
        </span>
      </div>
      
      {/* Support Methods List */}
      <div className="p-4 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveChat && liveChat.live_chat_url && (
            <a 
              href={liveChat.live_chat_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <MdChat className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Live Chat</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Chat with a support agent</p>
              </div>
            </a>
          )}

          {email && email.email && (
            <a 
              href={`mailto:${email.email}`}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <MdEmail className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Email Support</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{email.email}</p>
              </div>
            </a>
          )}
          
          {phone && phone.phone && (
            <a 
              href={`tel:${phone.phone}`} 
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <MdPhone className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Phone Support</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{phone.phone}</p>
              </div>
            </a>
          )}
          
          {availability && availability.support_availability && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <MdAccessTime className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Support Hours</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{availability.support_availability}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 