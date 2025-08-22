"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface SavedSearch {
    id: string
    query: string
    filters: SearchFilters
    createdAt: string
}

export interface SearchFilters {
    category?: string | null
    priority?: string | null
    tags?: string[] | null
    dateRange?: string | null
}

interface SearchStore {
    recentSearches: string[]
    savedSearches: SavedSearch[]
    searchFilters: SearchFilters
    addRecentSearch: (query: string) => void
    addSavedSearch: (search: SavedSearch) => void
    removeSavedSearch: (id: string) => void
    updateSearchFilters: (filters: SearchFilters) => void
    clearRecentSearches: () => void
}

export const useSearchStore = create<SearchStore>()(
    persist(
        (set, get) => ({
            recentSearches: [],
            savedSearches: [],
            searchFilters: {},

            addRecentSearch: (query: string) => {
                const { recentSearches } = get()
                const filtered = recentSearches.filter((search) => search !== query)
                set({
                    recentSearches: [query, ...filtered].slice(0, 10), // Keep only last 10
                })
            },

            addSavedSearch: (search: SavedSearch) => {
                const { savedSearches } = get()
                set({
                    savedSearches: [search, ...savedSearches].slice(0, 20), // Keep only 20 saved searches
                })
            },

            removeSavedSearch: (id: string) => {
                const { savedSearches } = get()
                set({
                    savedSearches: savedSearches.filter((search) => search.id !== id),
                })
            },

            updateSearchFilters: (filters: SearchFilters) => {
                set({ searchFilters: filters })
            },

            clearRecentSearches: () => {
                set({ recentSearches: [] })
            },
        }),
        {
            name: "docuhub-search-store",
        },
    ),
)
