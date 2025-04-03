"use client"

import { HiOutlineAdjustments, HiChevronDown, HiSortAscending, HiSortDescending, HiOutlineStar } from "react-icons/hi"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SortField, SortOrder } from "../../app/sweepstakes/client-page"

interface SortControlsProps {
  sortField: SortField
  sortOrder: SortOrder
  // eslint-disable-next-line no-unused-vars
  onSortChange: (field: SortField, order: SortOrder) => void
}

export function SortControls({ sortField, sortOrder, onSortChange }: SortControlsProps) {
  // Function to get current sort text
  const getSortText = () => {
    if (sortField === 'title' && sortOrder === 'asc') return 'Title: A-Z';
    if (sortField === 'title' && sortOrder === 'desc') return 'Title: Z-A';
    if (sortField === 'sweepstakes_review_count' && sortOrder === 'asc') return 'Reviews: Low-High';
    return 'Reviews: High-Low';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white flex items-center gap-2 border-none shadow-md transition-all duration-200 whitespace-nowrap min-w-[140px] px-4 h-12"
        >
          <HiOutlineAdjustments className="h-5 w-5" />
          <span className="flex-1 text-left">{getSortText()}</span>
          <HiChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-white text-purple-800 border border-purple-200 shadow-xl rounded-lg backdrop-blur-md overflow-hidden"
        sideOffset={5}
        align="end"
      >
        <div className="p-2">
          <div className="mb-2">
            <div className="px-2 py-1.5 text-xs font-semibold text-purple-600 uppercase tracking-wider">Title</div>
            <DropdownMenuGroup className="rounded-md overflow-hidden border border-purple-100">
              <DropdownMenuItem 
                className={`cursor-pointer hover:bg-purple-50 transition-colors duration-150 ${
                  sortField === 'title' && sortOrder === 'asc' ? 
                  'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-medium' : 
                  'text-purple-700'
                }`}
                onClick={() => onSortChange('title', 'asc')}
              >
                <HiSortAscending className={`mr-2 h-4 w-4 ${
                  sortField === 'title' && sortOrder === 'asc' ? 'text-purple-600' : 'text-purple-400'
                }`} />
                <span>Alphabetical (A-Z)</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`cursor-pointer hover:bg-purple-50 transition-colors duration-150 ${
                  sortField === 'title' && sortOrder === 'desc' ? 
                  'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-medium' : 
                  'text-purple-700'
                }`}
                onClick={() => onSortChange('title', 'desc')}
              >
                <HiSortDescending className={`mr-2 h-4 w-4 ${
                  sortField === 'title' && sortOrder === 'desc' ? 'text-purple-600' : 'text-purple-400'
                }`} />
                <span>Alphabetical (Z-A)</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </div>
          
          <div>
            <div className="px-2 py-1.5 text-xs font-semibold text-purple-600 uppercase tracking-wider">Popularity</div>
            <DropdownMenuGroup className="rounded-md overflow-hidden border border-purple-100">
              <DropdownMenuItem 
                className={`cursor-pointer hover:bg-purple-50 transition-colors duration-150 ${
                  sortField === 'sweepstakes_review_count' && sortOrder === 'asc' ? 
                  'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-medium' : 
                  'text-purple-700'
                }`}
                onClick={() => onSortChange('sweepstakes_review_count', 'asc')}
              >
                <HiOutlineStar className={`mr-2 h-4 w-4 ${
                  sortField === 'sweepstakes_review_count' && sortOrder === 'asc' ? 'text-purple-600' : 'text-purple-400'
                }`} />
                <span>Reviews (Low to High)</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`cursor-pointer hover:bg-purple-50 transition-colors duration-150 ${
                  (sortField === 'sweepstakes_review_count' && sortOrder === 'desc') || 
                  (!sortField && !sortOrder) ? 
                  'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-medium' : 
                  'text-purple-700'
                }`}
                onClick={() => onSortChange('sweepstakes_review_count', 'desc')}
              >
                <HiOutlineStar className={`mr-2 h-4 w-4 ${
                  (sortField === 'sweepstakes_review_count' && sortOrder === 'desc') || 
                  (!sortField && !sortOrder) ? 'text-purple-600' : 'text-purple-400'
                }`} />
                <span>Reviews (High to Low)</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 