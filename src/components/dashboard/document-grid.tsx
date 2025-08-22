"use client"

import { DocumentCard } from "./document-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, RefreshCw, Filter } from "lucide-react"
import { GoogleDocsService, type Document } from "@/lib/google-docs"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export function DocumentGrid() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("modified")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const googleDocsService = GoogleDocsService.getInstance()

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [documents, filter, sortBy, priorityFilter, selectedTags])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const docs = await googleDocsService.fetchDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error("Failed to load documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...documents]

    // Apply category filter
    if (filter !== "all") {
      filtered = filtered.filter((doc) => doc.category.toLowerCase().replace(" ", "-") === filter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((doc) => doc.priority === priorityFilter)
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((doc) => selectedTags.some((tagId) => doc.tags.some((tag) => tag.id === tagId)))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title)
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "created":
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        case "modified":
        default:
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      }
    })

    setFilteredDocuments(filtered)
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const clearFilters = () => {
    setFilter("all")
    setPriorityFilter("all")
    setSelectedTags([])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading documents...</span>
      </div>
    )
  }

  const tags = googleDocsService.getTags()
  const activeFiltersCount = (filter !== "all" ? 1 : 0) + (priorityFilter !== "all" ? 1 : 0) + selectedTags.length

  return (
    <div className="space-y-4">
      {/* Filters and View Options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="meeting-notes">Meeting Notes</SelectItem>
              <SelectItem value="proposals">Proposals</SelectItem>
              <SelectItem value="reports">Reports</SelectItem>
              <SelectItem value="technical-docs">Technical Docs</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modified">Last Modified</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="created">Date Created</SelectItem>
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadDocuments}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Tags:</span>
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              className={`cursor-pointer ${selectedTags.includes(tag.id) ? tag.color : ""}`}
              onClick={() => toggleTag(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Document Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No documents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              title={doc.title}
              category={doc.category}
              lastModified={doc.lastModified}
              collaborators={doc.collaborators}
              isShared={doc.isShared}
              tags={doc.tags}
              priority={doc.priority}
              description={doc.description}
            />
          ))}
        </div>
      )}
    </div>
  )
}
