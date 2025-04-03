import { create } from 'zustand'
import { client } from '@/tina/__generated__/client'
import { Casino as CasinoType } from '@/types/casino'
import { Sweepstakes as SweepstakesType } from '@/types/sweepstakes'

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

// Export the Sweepstakes type from the types folder but extend it with the required system fields
export interface Sweepstakes extends SweepstakesType {
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

  // Sweepstakes state
  sweepstakes: Sweepstakes[]
  sweepstakesLoading: boolean
  sweepstakesPagination: PaginationData | null
  sweepstakesSortField: 'title' | 'sweepstakes_review_count'
  sweepstakesSortOrder: 'asc' | 'desc'
  allSweepstakes: Sweepstakes[] // Store all sweepstakes data here
  filteredSweepstakes: Sweepstakes[] // Store filtered sweepstakes data here

  // Actions
  fetchPosts: (page?: number, searchQuery?: string) => Promise<void>
  fetchCasinos: (page?: number, searchQuery?: string) => Promise<void>
  setCasinoSort: (field: 'title' | 'casino_review_count', order: 'asc' | 'desc') => void
  getCasinoPage: (page: number, searchQuery?: string) => void
  fetchSweepstakes: (page?: number, searchQuery?: string) => Promise<void>
  setSweepstakesSort: (field: 'title' | 'sweepstakes_review_count', order: 'asc' | 'desc') => void
  getSweepstakesPage: (page: number, searchQuery?: string) => void
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
  
  sweepstakes: [],
  sweepstakesLoading: false,
  sweepstakesPagination: null,
  sweepstakesSortField: 'sweepstakes_review_count',
  sweepstakesSortOrder: 'desc',
  allSweepstakes: [],
  filteredSweepstakes: [],
  
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
    
    set({
      casinos: casinosForPage,
      casinosPagination: {
        currentPage: validPage,
        totalPages,
        totalItems,
        itemsPerPage: ITEMS_PER_PAGE
      }
    })
  },

  fetchSweepstakes: async (page = 1, searchQuery = '') => {
    const state = get()
    set({ sweepstakesLoading: true })
    
    // If we already have all sweepstakes, don't fetch again
    if (state.allSweepstakes.length > 0) {
      // Just filter and sort the existing data
      const { getSweepstakesPage } = get()
      
      // Apply search filter
      let filtered = [...state.allSweepstakes]
      if (searchQuery) {
        filtered = filtered.filter(sweepstake => 
          sweepstake.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      set({ filteredSweepstakes: filtered })
      
      // Apply pagination
      getSweepstakesPage(page)
      set({ sweepstakesLoading: false })
      return
    }
    
    try {
      // Fetch all sweepstakes at once for client-side operations
      const response = await client.queries.sweepstakesConnection({
        first: 1000, // Large enough to get all sweepstakes
      })
      
      // Extract sweepstakes data
      const sweepstakesData = response.data?.sweepstakesConnection?.edges || []
      const allSweepstakes = sweepstakesData.map(edge => edge?.node as Sweepstakes).filter(Boolean)
      
      // Store all sweepstakes
      set({ allSweepstakes })
      
      // Apply filtering if needed
      let filtered = [...allSweepstakes]
      if (searchQuery) {
        filtered = filtered.filter(sweepstake => 
          sweepstake.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      // Store filtered sweepstakes
      set({ filteredSweepstakes: filtered })
      
      // Apply sorting and pagination
      const { sweepstakesSortField, sweepstakesSortOrder, getSweepstakesPage } = get()
      
      // Sort filtered sweepstakes
      const sorted = sortSweepstakes(filtered, sweepstakesSortField, sweepstakesSortOrder)
      set({ filteredSweepstakes: sorted })
      
      // Apply pagination
      getSweepstakesPage(page)
      
      set({ sweepstakesLoading: false })
    } catch (error) {
      console.error('Error fetching sweepstakes:', error)
      set({ sweepstakesLoading: false })
    }
  },

  setSweepstakesSort: (field: 'title' | 'sweepstakes_review_count', order: 'asc' | 'desc') => {
    set({ 
      sweepstakesSortField: field, 
      sweepstakesSortOrder: order 
    })
    
    // Re-sort the sweepstakes
    const state = get()
    const filtered = state.filteredSweepstakes.length > 0 ? [...state.filteredSweepstakes] : [...state.allSweepstakes]
    
    // Apply sorting to filtered sweepstakes
    const sorted = sortSweepstakes(filtered, field, order)
    set({ filteredSweepstakes: sorted })
    
    // Apply pagination after sorting
    const { getSweepstakesPage } = get()
    const searchParams = new URLSearchParams(window.location.search)
    const page = Number(searchParams.get('page')) || 1
    getSweepstakesPage(page)
  },
  
  getSweepstakesPage: (page = 1, searchQuery = '') => {
    const state = get()
    const ITEMS_PER_PAGE = 10
    
    // Use filtered data if available, otherwise use all sweepstakes
    const dataSource = state.filteredSweepstakes.length > 0 
      ? state.filteredSweepstakes 
      : state.allSweepstakes
      
    // If search query is provided and different from current filter, re-filter
    if (searchQuery) {
      const filtered = state.allSweepstakes.filter(sweepstake => 
        sweepstake.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      // Sort the filtered data
      const sorted = sortSweepstakes(filtered, state.sweepstakesSortField, state.sweepstakesSortOrder)
      set({ filteredSweepstakes: sorted })
    }
    
    // Calculate total items and pages
    const totalItems = dataSource.length
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    
    // Ensure page is within valid range
    const validPage = Math.max(1, Math.min(page, totalPages))
    
    // Get sweepstakes for the current page
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const sweepstakesForPage = dataSource.slice(startIndex, endIndex)
    
    set({
      sweepstakes: sweepstakesForPage,
      sweepstakesPagination: {
        currentPage: validPage,
        totalPages,
        totalItems,
        itemsPerPage: ITEMS_PER_PAGE
      }
    })
  }
}))

function sortCasinos(
  casinos: Casino[], 
  field: 'title' | 'casino_review_count', 
  order: 'asc' | 'desc'
): Casino[] {
  return [...casinos].sort((a, b) => {
    if (field === 'title') {
      // Sort by title
      const comparison = a.title.localeCompare(b.title)
      return order === 'asc' ? comparison : -comparison
    } else if (field === 'casino_review_count') {
      // Sort by review count (treating undefined as 0)
      const countA = a.casino_review_count || 0
      const countB = b.casino_review_count || 0
      
      if (order === 'asc') {
        return countA - countB
      } else {
        return countB - countA
      }
    }
    return 0
  })
}

function sortSweepstakes(
  sweepstakes: Sweepstakes[], 
  field: 'title' | 'sweepstakes_review_count', 
  order: 'asc' | 'desc'
): Sweepstakes[] {
  return [...sweepstakes].sort((a, b) => {
    if (field === 'title') {
      // Sort by title
      const comparison = a.title.localeCompare(b.title)
      return order === 'asc' ? comparison : -comparison
    } else if (field === 'sweepstakes_review_count') {
      // Sort by review count (treating undefined as 0)
      const countA = a.sweepstakes_review_count || 0
      const countB = b.sweepstakes_review_count || 0
      
      if (order === 'asc') {
        return countA - countB
      } else {
        return countB - countA
      }
    }
    return 0
  })
}

export async function getInitialCasinoData() {
  try {
    const response = await client.queries.casinoConnection({
      first: 10,
    })
    
    return {
      data: response,
      casinoSortField: 'casino_review_count' as 'title' | 'casino_review_count',
      casinoSortOrder: 'desc' as 'asc' | 'desc',
    }
  } catch (error) {
    console.error('Error fetching initial casino data:', error)
    return {
      data: null,
      casinoSortField: 'casino_review_count' as 'title' | 'casino_review_count',
      casinoSortOrder: 'desc' as 'asc' | 'desc',
    }
  }
}

export async function getInitialSweepstakesData() {
  try {
    const response = await client.queries.sweepstakesConnection({
      first: 10,
    })
    
    return {
      data: response,
      sweepstakesSortField: 'sweepstakes_review_count' as 'title' | 'sweepstakes_review_count',
      sweepstakesSortOrder: 'desc' as 'asc' | 'desc',
    }
  } catch (error) {
    console.error('Error fetching initial sweepstakes data:', error)
    return {
      data: null,
      sweepstakesSortField: 'sweepstakes_review_count' as 'title' | 'sweepstakes_review_count',
      sweepstakesSortOrder: 'desc' as 'asc' | 'desc',
    }
  }
}

async function getCursorForPage(
  type: 'post' | 'casino' | 'sweepstakes',
  page: number, 
  itemsPerPage: number, 
  searchQuery?: string
): Promise<string | undefined> {
  try {
    const index = (page * itemsPerPage) - 1
    
    // Different connection query based on content type
    if (type === 'post') {
      const result = await client.queries.postConnection({
        first: 1,
        after: `${index}`,
        filter: searchQuery ? {
          title: { startsWith: searchQuery }
        } : undefined,
      })
      
      const edge = result.data?.postConnection?.pageInfo?.endCursor
      return edge ? edge : undefined
    } else if (type === 'casino') {
      const result = await client.queries.casinoConnection({
        first: 1,
        after: `${index}`,
        filter: searchQuery ? {
          title: { startsWith: searchQuery }
        } : undefined,
      })
      
      const edge = result.data?.casinoConnection?.pageInfo?.endCursor
      return edge ? edge : undefined
    } else if (type === 'sweepstakes') {
      const result = await client.queries.sweepstakesConnection({
        first: 1,
        after: `${index}`,
        filter: searchQuery ? {
          title: { startsWith: searchQuery }
        } : undefined,
      })
      
      const edge = result.data?.sweepstakesConnection?.pageInfo?.endCursor
      return edge ? edge : undefined
    }
    
    return undefined
  } catch (error) {
    console.error(`Error getting cursor for page ${page}:`, error)
    return undefined
  }
} 