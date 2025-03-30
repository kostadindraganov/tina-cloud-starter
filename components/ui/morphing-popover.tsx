'use client';

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useClickOutside } from "@/hooks/use-click-outside"

interface MorphingPopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  showPopover: boolean
  setShowPopover: (showPopover: boolean) => void
  bgColor?: string
  textColor?: string
  borderColor?: string
  position?: "top" | "bottom" | "left" | "right"
  className?: string
}

export const MorphingPopover = ({
  trigger,
  content,
  showPopover,
  setShowPopover,
  bgColor = "bg-white dark:bg-gray-800",
  textColor = "text-black dark:text-white",
  borderColor = "border-gray-200 dark:border-gray-700",
  position = "top",
  className = "",
}: MorphingPopoverProps) => {
  const ref = useClickOutside(() => {
    setShowPopover(false)
  })

  const getPosition = () => {
    switch (position) {
      case "top":
        return "bottom-full mb-2"
      case "bottom":
        return "top-full mt-2"
      case "left":
        return "right-full mr-2"
      case "right":
        return "left-full ml-2"
      default:
        return "bottom-full mb-2"
    }
  }

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setShowPopover(!showPopover)}>{trigger}</div>

      <AnimatePresence>
        {showPopover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className={`absolute z-50 ${getPosition()} min-w-[180px] overflow-hidden rounded-md border shadow-md ${bgColor} ${textColor} ${borderColor} ${className}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
