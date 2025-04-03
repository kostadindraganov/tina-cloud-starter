import { create } from 'zustand'
import { Sweepstakes } from './index'

interface SweepstakesSearchState {
  // Search input state
  searchQuery: string
  isDropdownOpen: boolean
  searchResults: Sweepstakes[]
  isLoading: boolean

  // Actions
  setSearchQuery: (query: string) => void
  toggleDropdown: (isOpen?: boolean) => void
  setSearchResults: (results: Sweepstakes[]) => void
  setIsLoading: (isLoading: boolean) => void
  searchSweepstakes: (sweepstakes: Sweepstakes[]) => void
  clearSearch: () => void
}

export const useSweepstakesSearchStore = create<SweepstakesSearchState>((set, get) => ({
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
    
    // If we have access to sweepstakes, search them
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

  setSearchResults: (results: Sweepstakes[]) => {
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

  searchSweepstakes: (sweepstakes: Sweepstakes[]) => {
    const { searchQuery } = get()
    const query = searchQuery.toLowerCase().trim()
    
    if (!query) {
      set({ searchResults: [], isLoading: false })
      return
    }
    
    // Search through title and tags (if available)
    const results = sweepstakes.filter(sweepstake => {
      // Search in title (case insensitive)
      const titleMatch = sweepstake.title.toLowerCase().includes(query)
      
      // Search in tags (if sweepstake has tags property)
      const tags = (sweepstake as any).tags || []
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