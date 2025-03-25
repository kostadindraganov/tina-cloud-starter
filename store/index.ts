import { create } from 'zustand'
import { client } from '@/tina/__generated__/client'
import { Casino as CasinoType } from '@/types/casino'

// Define types based on what we've seen in the codebase
export interface Author {
  name?: string
  avatar?: string
}

export interface Post {
  id: string
  title: string
  date: string
  excerpt?: any // rich-text content
  author?: Author
  _sys: {
    filename: string
    breadcrumbs: string[]
  }
}

// Export the Casino type from the types folder but extend it with the required system fields
export interface Casino extends CasinoType {
  id: string
  _sys: {
    filename: string
    breadcrumbs: string[]
  }
}

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface AppState {
  // Posts state
  posts: Post[]
  postsLoading: boolean
  postsPagination: PaginationData | null
  
  // Casinos state
  casinos: Casino[]
  casinosLoading: boolean
  casinosPagination: PaginationData | null
  casinoSortField: 'title' | 'casino_review_count'
  casinoSortOrder: 'asc' | 'desc'
  allCasinos: Casino[] // Store all casino data here
  filteredCasinos: Casino[] // Store filtered casino data here

  // Actions
  fetchPosts: (page?: number, searchQuery?: string) => Promise<void>
  fetchCasinos: (page?: number, searchQuery?: string) => Promise<void>
  setCasinoSort: (field: 'title' | 'casino_review_count', order: 'asc' | 'desc') => void
  getCasinoPage: (page: number, searchQuery?: string) => void
}

// Create the store
export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  posts: [],
  postsLoading: false,
  postsPagination: null,
  
  casinos: [],
  casinosLoading: false,
  casinosPagination: null,
  casinoSortField: 'casino_review_count',
  casinoSortOrder: 'desc',
  allCasinos: [],
  filteredCasinos: [],
  
  // Actions
  fetchPosts: async (page = 1, searchQuery = '') => {
    set({ postsLoading: true })
    
    try {
      const ITEMS_PER_PAGE = 10
      
      // Calculate total count first to know total pages
      const countQuery = await client.queries.postConnection({
        sort: 'date',
        first: 0,
        filter: searchQuery ? {
          title: { startsWith: searchQuery }
        } : undefined
      })
      
      const totalItems = countQuery.data?.postConnection.totalCount || 0
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
      
      // Fetch items for current page
      const posts = await client.queries.postConnection({
        sort: 'date',
        first: ITEMS_PER_PAGE,
        filter: searchQuery ? {
          title: { startsWith: searchQuery }
        } : undefined,
        // Skip items from previous pages
        after: page > 1 
          ? await getCursorForPage('post', page - 1, ITEMS_PER_PAGE, searchQuery) 
          : undefined,
      })
      
      // For better UX, reverse the order if needed
      const postsData = posts.data?.postConnection?.edges || []
      const formattedPosts = postsData.map(edge => edge?.node as Post).filter(Boolean)
      
      if (formattedPosts.length) {
        formattedPosts.reverse()
      }
      
      set({
        posts: formattedPosts,
        postsLoading: false,
        postsPagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: ITEMS_PER_PAGE
        }
      })
    } catch (error) {
      console.error('Error fetching posts:', error)
      set({ postsLoading: false })
    }
  },
  
  fetchCasinos: async (page = 1, searchQuery = '') => {
    const state = get()
    set({ casinosLoading: true })
    
    // If we already have all casinos, don't fetch again
    if (state.allCasinos.length > 0) {
      // Just filter and sort the existing data
      const { getCasinoPage } = get()
      
      // Apply search filter
      let filtered = [...state.allCasinos]
      if (searchQuery) {
        filtered = filtered.filter(casino => 
          casino.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      set({ filteredCasinos: filtered })
      
      // Apply pagination
      getCasinoPage(page)
      set({ casinosLoading: false })
      return
    }
    
    try {
      // Fetch all casinos at once for client-side operations
      const response = await client.queries.casinoConnection({
        first: 1000, // Large enough to get all casinos
      })
      
      // Extract casino data
      const casinosData = response.data?.casinoConnection?.edges || []
      const allCasinos = casinosData.map(edge => edge?.node as Casino).filter(Boolean)
      
      // Store all casinos
      set({ allCasinos })
      
      // Apply filtering if needed
      let filtered = [...allCasinos]
      if (searchQuery) {
        filtered = filtered.filter(casino => 
          casino.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      // Store filtered casinos
      set({ filteredCasinos: filtered })
      
      // Apply sorting and pagination
      const { casinoSortField, casinoSortOrder, getCasinoPage } = get()
      
      // Sort filtered casinos
      const sorted = sortCasinos(filtered, casinoSortField, casinoSortOrder)
      set({ filteredCasinos: sorted })
      
      // Apply pagination
      getCasinoPage(page)
      
      set({ casinosLoading: false })
    } catch (error) {
      console.error('Error fetching casinos:', error)
      set({ casinosLoading: false })
    }
  },

  setCasinoSort: (field: 'title' | 'casino_review_count', order: 'asc' | 'desc') => {
    set({ 
      casinoSortField: field, 
      casinoSortOrder: order 
    })
    
    // Re-sort the casinos
    const state = get()
    const filtered = state.filteredCasinos.length > 0 ? [...state.filteredCasinos] : [...state.allCasinos]
    
    // Apply sorting to filtered casinos
    const sorted = sortCasinos(filtered, field, order)
    set({ filteredCasinos: sorted })
    
    // Apply pagination after sorting
    const { getCasinoPage } = get()
    const searchParams = new URLSearchParams(window.location.search)
    const page = Number(searchParams.get('page')) || 1
    getCasinoPage(page)
  },
  
  getCasinoPage: (page = 1, searchQuery = '') => {
    const state = get()
    const ITEMS_PER_PAGE = 10
    
    // Use filtered data if available, otherwise use all casinos
    const dataSource = state.filteredCasinos.length > 0 
      ? state.filteredCasinos 
      : state.allCasinos
      
    // If search query is provided and different from current filter, re-filter
    if (searchQuery) {
      const filtered = state.allCasinos.filter(casino => 
        casino.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      // Sort the filtered data
      const sorted = sortCasinos(filtered, state.casinoSortField, state.casinoSortOrder)
      set({ filteredCasinos: sorted })
    }
    
    // Calculate total items and pages
    const totalItems = dataSource.length
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    
    // Ensure page is within valid range
    const validPage = Math.max(1, Math.min(page, totalPages))
    
    // Get casinos for the current page
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const casinosForPage = dataSource.slice(startIndex, endIndex)
    
    // Update state
    set({
      casinos: casinosForPage,
      casinosPagination: {
        currentPage: validPage,
        totalPages,
        totalItems,
        itemsPerPage: ITEMS_PER_PAGE
      }
    })
  }
}))

// Helper function to sort casinos
function sortCasinos(
  casinos: Casino[], 
  field: 'title' | 'casino_review_count', 
  order: 'asc' | 'desc'
): Casino[] {
  const sorted = [...casinos].sort((a, b) => {
    if (field === 'title') {
      const titleA = (a.title || '').toLowerCase()
      const titleB = (b.title || '').toLowerCase()
      return order === 'asc' 
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA)
    } else { // casino_review_count
      const countA = a.casino_review_count || 0
      const countB = b.casino_review_count || 0
      return order === 'asc' 
        ? countA - countB
        : countB - countA
    }
  })
  
  return sorted
}

// Function to get initial casino data for server-side rendering
export async function getInitialCasinoData() {
  try {
    // Fetch all casinos at once
    const response = await client.queries.casinoConnection({
      first: 1000, // Large enough to get all casinos
    })
    
    // Extract casino data
    const casinosData = response.data?.casinoConnection?.edges || []
    const allCasinos = casinosData.map(edge => edge?.node as Casino).filter(Boolean)
    
    // Return all casinos in the data
    return {
      data: {
        ...response.data,
        _allCasinos: allCasinos,
      },
      query: response.query,
      variables: response.variables
    }
  } catch (error) {
    console.error('Error fetching all casino data:', error)
    throw error
  }
}

// Helper function to get cursor for pagination
async function getCursorForPage(
  type: 'post' | 'casino',
  page: number, 
  itemsPerPage: number, 
  searchQuery?: string
): Promise<string | undefined> {
  if (page <= 0) return undefined
  
  const skipCount = (page * itemsPerPage) - 1
  
  // Fetch just enough to get the cursor
  if (type === 'post') {
    const result = await client.queries.postConnection({
      sort: 'date',
      first: skipCount + 1,
      filter: searchQuery ? {
        title: { startsWith: searchQuery }
      } : undefined,
    })
    
    const edges = result.data?.postConnection?.edges
    if (!edges || edges.length === 0) return undefined
    
    const lastEdge = edges[edges.length - 1]
    return lastEdge?.cursor
  } else {
    const result = await client.queries.casinoConnection({
      sort: 'casino_review_count', // Changed from 'date' to match page.tsx
      first: skipCount + 1,
      filter: searchQuery ? {
        title: { startsWith: searchQuery }
      } : undefined,
    })
    
    const edges = result.data?.casinoConnection?.edges
    if (!edges || edges.length === 0) return undefined
    
    const lastEdge = edges[edges.length - 1]
    return lastEdge?.cursor
  }
} 