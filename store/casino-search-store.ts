import { create } from 'zustand'
import { Casino } from './index'

interface CasinoSearchState {
  // Search input state
  searchQuery: string
  isDropdownOpen: boolean
  searchResults: Casino[]
  isLoading: boolean

  // Actions
  setSearchQuery: (query: string) => void
  toggleDropdown: (isOpen?: boolean) => void
  setSearchResults: (results: Casino[]) => void
  setIsLoading: (isLoading: boolean) => void
  searchCasinos: (casinos: Casino[]) => void
  clearSearch: () => void
}

export const useCasinoSearchStore = create<CasinoSearchState>((set, get) => ({
  // Initial state
  searchQuery: '',
  isDropdownOpen: false,
  searchResults: [],
  isLoading: false,

  // Actions
  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
    
    // When query is empty, clear results and close dropdown
    if (!query.trim()) {
      set({ 
        searchResults: [],
        isDropdownOpen: false
      })
      return
    }
    
    // When query changes, keep dropdown open
    set({ isDropdownOpen: true })
    
    // If we have access to casinos, search them
    const state = get()
    if (!state.isLoading) {
      state.setIsLoading(true)
      // We'll use debounced search in the component
    }
  },

  toggleDropdown: (isOpen?: boolean) => {
    if (typeof isOpen === 'boolean') {
      set({ isDropdownOpen: isOpen })
    } else {
      set(state => ({ isDropdownOpen: !state.isDropdownOpen }))
    }
  },

  setSearchResults: (results: Casino[]) => {
    set({ 
      searchResults: results,
      isLoading: false,
      // Only keep dropdown open if we have results or query is not empty
      isDropdownOpen: results.length > 0 || get().searchQuery.trim().length > 0
    })
  },

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  searchCasinos: (casinos: Casino[]) => {
    const { searchQuery } = get()
    const query = searchQuery.toLowerCase().trim()
    
    if (!query) {
      set({ searchResults: [], isLoading: false })
      return
    }
    
    // Search through title and tags (if available)
    const results = casinos.filter(casino => {
      // Search in title (case insensitive)
      const titleMatch = casino.title.toLowerCase().includes(query)
      
      // Search in tags (if casino has tags property)
      const tags = (casino as any).tags || []
      const tagMatch = Array.isArray(tags) && 
        tags.some((tag: string) => 
          tag.toLowerCase().includes(query)
        )
      
      return titleMatch || tagMatch
    })
    
    set({ 
      searchResults: results,
      isLoading: false
    })
  },
  
  clearSearch: () => {
    set({ 
      searchQuery: '',
      searchResults: [],
      isDropdownOpen: false,
      isLoading: false
    })
  }
})) 