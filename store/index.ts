import { create } from 'zustand'
import { client } from '@/tina/__generated__/client'

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

export interface Casino {
  id: string
  title: string
  date: string
  featured?: boolean
  casino_review_count?: number
  player_review_count?: number
  casino_url?: string
  year_established?: string
  owner?: string
  owner_company_url?: string
  affiliate_url?: string
  logo?: string
  heroImg?: string
  excerpt?: any // rich-text content
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

  // Actions
  fetchPosts: (page?: number, searchQuery?: string) => Promise<void>
  fetchCasinos: (page?: number, searchQuery?: string) => Promise<void>
}

// Create the store
export const useAppStore = create<AppState>((set) => ({
  // Initial state
  posts: [],
  postsLoading: false,
  postsPagination: null,
  
  casinos: [],
  casinosLoading: false,
  casinosPagination: null,
  
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
    set({ casinosLoading: true })
    
    try {
      const ITEMS_PER_PAGE = 10
      
      // Calculate total count first to know total pages
      const countQuery = await client.queries.casinoConnection({
        sort: 'date',
        first: 0,
        filter: searchQuery ? {
          title: { startsWith: searchQuery }
        } : undefined
      })
      
      const totalItems = countQuery.data?.casinoConnection.totalCount || 0
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
      
      // Fetch items for current page
      const casinos = await client.queries.casinoConnection({
        sort: 'date',
        first: ITEMS_PER_PAGE,
        filter: searchQuery ? {
          title: { startsWith: searchQuery }
        } : undefined,
        // Skip items from previous pages
        after: page > 1 
          ? await getCursorForPage('casino', page - 1, ITEMS_PER_PAGE, searchQuery) 
          : undefined,
      })
      
      // For better UX, reverse the order if needed
      const casinosData = casinos.data?.casinoConnection?.edges || []
      const formattedCasinos = casinosData.map(edge => edge?.node as Casino).filter(Boolean)
      
      if (formattedCasinos.length) {
        formattedCasinos.reverse()
      }
      
      set({
        casinos: formattedCasinos,
        casinosLoading: false,
        casinosPagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: ITEMS_PER_PAGE
        }
      })
    } catch (error) {
      console.error('Error fetching casinos:', error)
      set({ casinosLoading: false })
    }
  }
}))

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
      sort: 'date',
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