"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination"
import { PaginationInfo } from "../../app/casino/client-page"

interface PaginationControlsProps {
  pagination: PaginationInfo
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void
}

export function PaginationControls(props: PaginationControlsProps) {
  const { pagination, onPageChange } = props
  const { currentPage, totalPages } = pagination

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous page button */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage - 1)
              }} 
            />
          </PaginationItem>
        )}
        
        {/* First page */}
        <PaginationItem>
          <PaginationLink 
            href="#" 
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault()
              onPageChange(1)
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>

        {/* Ellipsis if needed */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Page before current if applicable */}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage - 1)
              }}
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Current page (if not first or last) */}
        {currentPage !== 1 && currentPage !== totalPages && (
          <PaginationItem>
            <PaginationLink 
              href="#" 
              isActive={true}
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage)
              }}
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Page after current if applicable */}
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage + 1)
              }}
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Ellipsis if needed */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last page (if not first) */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink 
              href="#" 
              isActive={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault()
                onPageChange(totalPages)
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next page button */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                onPageChange(currentPage + 1)
              }} 
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
} 