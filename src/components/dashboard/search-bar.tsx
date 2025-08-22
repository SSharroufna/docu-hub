"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { GoogleDocsService, type Document } from "@/lib/google-docs"
import { Search, Clock, FileText, Filter, X, Bookmark } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useSearchStore } from "@/lib/search-store"

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Document[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const {
    recentSearches,
    savedSearches,
    addRecentSearch,
    addSavedSearch,
    removeSavedSearch,
    searchFilters,
    updateSearchFilters,
  } = useSearchStore()

  const googleDocsService = GoogleDocsService.getInstance()

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }

      try {
        const documents = await googleDocsService.fetchDocuments()
        const results = googleDocsService.searchDocuments(searchQuery)

        // Apply additional filters
        let filteredResults = results

        if (searchFilters.category && searchFilters.category !== "all") {
          filteredResults = filteredResults.filter(
            (doc) => doc.category.toLowerCase().replace(" ", "-") === searchFilters.category,
          )
        }

        if (searchFilters.priority && searchFilters.priority !== "all") {
          filteredResults = filteredResults.filter((doc) => doc.priority === searchFilters.priority)
        }

        if (searchFilters.tags && searchFilters.tags.length > 0) {
          filteredResults = filteredResults.filter((doc) =>
            searchFilters.tags!.some((tagId) => doc.tags.some((tag) => tag.id === tagId)),
          )
        }

        setSearchResults(filteredResults)
        addRecentSearch(searchQuery)
      } catch (error) {
        console.error("Search failed:", error)
        setSearchResults([])
      }
    },
    [searchFilters, addRecentSearch, googleDocsService],
  )

  const generateSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      return
    }

    const commonTerms = [
      "meeting notes",
      "proposal",
      "report",
      "technical docs",
      "api documentation",
      "project plan",
      "strategy",
      "roadmap",
      "analysis",
      "presentation",
    ]

    const filtered = commonTerms.filter((term) => term.toLowerCase().includes(searchQuery.toLowerCase()))
    setSuggestions(filtered.slice(0, 5))
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        performSearch(query)
        generateSuggestions(query)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, performSearch, generateSuggestions])

  const handleSearchSelect = (searchQuery: string) => {
    setQuery(searchQuery)
    performSearch(searchQuery)
    setIsOpen(false)
  }

  const handleSaveSearch = () => {
    if (query.trim()) {
      addSavedSearch({
        id: Date.now().toString(),
        query,
        filters: searchFilters,
        createdAt: new Date().toISOString(),
      })
    }
  }

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10 pr-10 bg-background"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setIsAdvancedOpen(true)}
            >
              <Filter className="h-3 w-3" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <Command>
            <CommandList>
              {/* Recent Searches */}
              {recentSearches.length > 0 && !query && (
                <>
                  <CommandGroup heading="Recent Searches">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <CommandItem key={index} onSelect={() => handleSearchSelect(search)}>
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {search}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* Saved Searches */}
              {savedSearches.length > 0 && !query && (
                <>
                  <CommandGroup heading="Saved Searches">
                    {savedSearches.slice(0, 3).map((search) => (
                      <CommandItem key={search.id} onSelect={() => handleSearchSelect(search.query)}>
                        <Bookmark className="mr-2 h-4 w-4 text-muted-foreground" />
                        {search.query}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto h-4 w-4 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeSavedSearch(search.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && query && (
                <>
                  <CommandGroup heading="Suggestions">
                    {suggestions.map((suggestion, index) => (
                      <CommandItem key={index} onSelect={() => handleSearchSelect(suggestion)}>
                        <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && query && (
                <CommandGroup heading={`Results (${searchResults.length})`}>
                  {searchResults.slice(0, 8).map((doc) => (
                    <CommandItem key={doc.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">{doc.title}</div>
                          <div className="text-xs text-muted-foreground">{doc.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {doc.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag.id} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </CommandItem>
                  ))}
                  {searchResults.length > 8 && (
                    <CommandItem className="text-center text-muted-foreground">
                      +{searchResults.length - 8} more results
                    </CommandItem>
                  )}
                </CommandGroup>
              )}

              {/* No Results */}
              {query && searchResults.length === 0 && suggestions.length === 0 && (
                <CommandEmpty>No documents found for "{query}"</CommandEmpty>
              )}

              {/* Save Search Option */}
              {query && searchResults.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem onSelect={handleSaveSearch}>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save this search
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        onSearch={(advancedQuery, filters) => {
          setQuery(advancedQuery)
          updateSearchFilters(filters)
          performSearch(advancedQuery)
          setIsAdvancedOpen(false)
        }}
      />
    </div>
  )
}

interface AdvancedSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string, filters: any) => void
}

function AdvancedSearchModal({ isOpen, onClose, onSearch }: AdvancedSearchModalProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [priority, setPriority] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateRange, setDateRange] = useState("all")

  const googleDocsService = GoogleDocsService.getInstance()
  const categories = googleDocsService.getCategories()
  const tags = googleDocsService.getTags()

  const handleSearch = () => {
    onSearch(query, {
      category: category !== "all" ? category : null,
      priority: priority !== "all" ? priority : null,
      tags: selectedTags.length > 0 ? selectedTags : null,
      dateRange: dateRange !== "all" ? dateRange : null,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Advanced Search</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Query</label>
              <Input placeholder="Enter search terms..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(tag.id) ? prev.filter((id) => id !== tag.id) : [...prev, tag.id],
                      )
                    }
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <select
                className="w-full p-2 border rounded-md"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
