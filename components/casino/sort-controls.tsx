"use client"

import { BiSort } from "react-icons/bi"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SortField, SortOrder } from "../../app/casino/client-page"

interface SortControlsProps {
  sortField: SortField
  sortOrder: SortOrder
  // eslint-disable-next-line no-unused-vars
  onSortChange: (field: SortField, order: SortOrder) => void
}

export function SortControls({ sortField, sortOrder, onSortChange }: SortControlsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          className="bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2 border border-gray-700"
        >
          <BiSort className="h-4 w-4" />
          <span>Sort Casinos</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-gray-800 text-white border border-gray-700 shadow-lg"
        sideOffset={5}
      >
        <DropdownMenuLabel className="text-gray-300 font-medium">Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className={`cursor-pointer hover:bg-gray-700 ${sortField === 'title' && sortOrder === 'asc' ? 'bg-gray-700 text-blue-300' : ''}`}
            onClick={() => onSortChange('title', 'asc')}
          >
            Title (A-Z)
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`cursor-pointer hover:bg-gray-700 ${sortField === 'title' && sortOrder === 'desc' ? 'bg-gray-700 text-blue-300' : ''}`}
            onClick={() => onSortChange('title', 'desc')}
          >
            Title (Z-A)
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem 
            className={`cursor-pointer hover:bg-gray-700 ${sortField === 'casino_review_count' && sortOrder === 'asc' ? 'bg-gray-700 text-blue-300' : ''}`}
            onClick={() => onSortChange('casino_review_count', 'asc')}
          >
            Review Count (Low to High)
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`cursor-pointer hover:bg-gray-700 ${
              (sortField === 'casino_review_count' && sortOrder === 'desc') || 
              (!sortField && !sortOrder) ? 
                'bg-gray-700 text-blue-300' : ''
            }`}
            onClick={() => onSortChange('casino_review_count', 'desc')}
          >
            Review Count (High to Low)
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 