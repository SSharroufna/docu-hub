"use client"

export interface Tag {
    id: string
    name: string
    color: string
}

export interface Document {
    id: string
    title: string
    category: string
    lastModified: string
    collaborators: number
    isShared: boolean
    webViewLink?: string
    owner?: string
    tags: Tag[]
    priority: "low" | "medium" | "high"
    description?: string
}

export interface Category {
    id: string
    name: string
    color: string
    icon: string
    count: number
}

export class GoogleDocsService {
    private static instance: GoogleDocsService
    private documents: Document[] = []
    private categories: Category[] = []
    private tags: Tag[] = []

    static getInstance(): GoogleDocsService {
        if (!GoogleDocsService.instance) {
            GoogleDocsService.instance = new GoogleDocsService()
            GoogleDocsService.instance.initializeCategories()
            GoogleDocsService.instance.initializeTags()
        }
        return GoogleDocsService.instance
    }

    private initializeCategories() {
        this.categories = [
            { id: "meeting-notes", name: "Meeting Notes", color: "bg-blue-100 text-blue-800", icon: "Calendar", count: 0 },
            { id: "proposals", name: "Proposals", color: "bg-green-100 text-green-800", icon: "PresentationChart", count: 0 },
            { id: "reports", name: "Reports", color: "bg-purple-100 text-purple-800", icon: "ClipboardList", count: 0 },
            {
                id: "technical-docs",
                name: "Technical Docs",
                color: "bg-orange-100 text-orange-800",
                icon: "BookOpen",
                count: 0,
            },
            { id: "general", name: "General", color: "bg-gray-100 text-gray-800", icon: "FileText", count: 0 },
        ]
    }

    private initializeTags() {
        this.tags = [
            { id: "urgent", name: "Urgent", color: "bg-red-100 text-red-800" },
            { id: "draft", name: "Draft", color: "bg-yellow-100 text-yellow-800" },
            { id: "review", name: "Review", color: "bg-blue-100 text-blue-800" },
            { id: "approved", name: "Approved", color: "bg-green-100 text-green-800" },
            { id: "archived", name: "Archived", color: "bg-gray-100 text-gray-800" },
            { id: "template", name: "Template", color: "bg-purple-100 text-purple-800" },
        ]
    }

    getCategories(): Category[] {
        // Update counts
        this.categories.forEach((category) => {
            category.count = this.documents.filter(
                (doc) => doc.category.toLowerCase().replace(" ", "-") === category.id,
            ).length
        })
        return this.categories
    }

    getTags(): Tag[] {
        return this.tags
    }

    async addTag(documentId: string, tagId: string): Promise<void> {
        const document = this.documents.find((doc) => doc.id === documentId)
        const tag = this.tags.find((t) => t.id === tagId)

        if (document && tag && !document.tags.some((t) => t.id === tagId)) {
            document.tags.push(tag)
            // In a real app, this would sync with the backend
            await this.syncDocumentTags(documentId, document.tags)
        }
    }

    async removeTag(documentId: string, tagId: string): Promise<void> {
        const document = this.documents.find((doc) => doc.id === documentId)

        if (document) {
            document.tags = document.tags.filter((tag) => tag.id !== tagId)
            // In a real app, this would sync with the backend
            await this.syncDocumentTags(documentId, document.tags)
        }
    }

    async updateDocumentCategory(documentId: string, categoryId: string): Promise<void> {
        const document = this.documents.find((doc) => doc.id === documentId)
        const category = this.categories.find((cat) => cat.id === categoryId)

        if (document && category) {
            document.category = category.name
            // In a real app, this would sync with the backend
            await this.syncDocumentCategory(documentId, category.name)
        }
    }

    private async syncDocumentTags(documentId: string, tags: Tag[]): Promise<void> {
        // Placeholder for API call to sync tags
        console.log(`Syncing tags for document ${documentId}:`, tags)
    }

    private async syncDocumentCategory(documentId: string, category: string): Promise<void> {
        // Placeholder for API call to sync category
        console.log(`Syncing category for document ${documentId}:`, category)
    }

    private smartCategorizeDocument(
        title: string,
        content?: string,
    ): { category: string; tags: Tag[]; priority: "low" | "medium" | "high" } {
        const lowerTitle = title.toLowerCase()
        const lowerContent = content?.toLowerCase() || ""
        const combinedText = `${lowerTitle} ${lowerContent}`

        let category = "General"
        const tags: Tag[] = []
        let priority: "low" | "medium" | "high" = "medium"

        // Category detection
        if (combinedText.includes("meeting") || combinedText.includes("standup") || combinedText.includes("notes")) {
            category = "Meeting Notes"
        } else if (combinedText.includes("proposal") || combinedText.includes("pitch") || combinedText.includes("rfp")) {
            category = "Proposals"
        } else if (
            combinedText.includes("report") ||
            combinedText.includes("analysis") ||
            combinedText.includes("summary")
        ) {
            category = "Reports"
        } else if (
            combinedText.includes("api") ||
            combinedText.includes("technical") ||
            combinedText.includes("documentation") ||
            combinedText.includes("spec")
        ) {
            category = "Technical Docs"
        }

        // Tag detection
        if (combinedText.includes("urgent") || combinedText.includes("asap") || combinedText.includes("priority")) {
            tags.push(this.tags.find((t) => t.id === "urgent")!)
            priority = "high"
        }
        if (combinedText.includes("draft") || combinedText.includes("wip") || combinedText.includes("work in progress")) {
            tags.push(this.tags.find((t) => t.id === "draft")!)
        }
        if (combinedText.includes("review") || combinedText.includes("feedback")) {
            tags.push(this.tags.find((t) => t.id === "review")!)
        }
        if (combinedText.includes("template") || combinedText.includes("boilerplate")) {
            tags.push(this.tags.find((t) => t.id === "template")!)
        }

        return { category, tags: tags.filter(Boolean), priority }
    }

    async fetchDocuments(): Promise<Document[]> {
        try {
            console.log("[v0] Attempting to fetch documents from API...")
            const response = await fetch("/api/documents")

            if (!response.ok) {
                console.log("[v0] API fetch failed, using mock data")
                return this.getMockDocuments()
            }

            const data = await response.json()
            console.log("[v0] Successfully fetched documents from API")
            this.documents = data.documents || []
            return this.documents
        } catch (error) {
            console.log("[v0] Error fetching documents, using mock data:", error)
            return this.getMockDocuments()
        }
    }

    async fetchDocument(id: string) {
        try {
            const response = await fetch(`/api/documents/${id}`)

            if (!response.ok) {
                throw new Error("Failed to fetch document")
            }

            return await response.json()
        } catch (error) {
            console.error("Error fetching document:", error)
            throw error
        }
    }

    searchDocuments(query: string): Document[] {
        if (!query.trim()) return this.documents

        const lowerQuery = query.toLowerCase()
        return this.documents.filter((doc) => {
            // Search in title
            if (doc.title.toLowerCase().includes(lowerQuery)) return true

            // Search in category
            if (doc.category.toLowerCase().includes(lowerQuery)) return true

            // Search in description
            if (doc.description?.toLowerCase().includes(lowerQuery)) return true

            // Search in tags
            if (doc.tags.some((tag) => tag.name.toLowerCase().includes(lowerQuery))) return true

            // Search in owner
            if (doc.owner?.toLowerCase().includes(lowerQuery)) return true

            return false
        })
    }

    advancedSearch(query: string, filters: any): Document[] {
        let results = this.searchDocuments(query)

        // Apply category filter
        if (filters.category && filters.category !== "all") {
            results = results.filter((doc) => doc.category.toLowerCase().replace(" ", "-") === filters.category)
        }

        // Apply priority filter
        if (filters.priority && filters.priority !== "all") {
            results = results.filter((doc) => doc.priority === filters.priority)
        }

        // Apply tag filters
        if (filters.tags && filters.tags.length > 0) {
            results = results.filter((doc) => filters.tags.some((tagId: string) => doc.tags.some((tag) => tag.id === tagId)))
        }

        // Apply date range filter
        if (filters.dateRange && filters.dateRange !== "all") {
            const now = new Date()
            const filterDate = new Date()

            switch (filters.dateRange) {
                case "today":
                    filterDate.setHours(0, 0, 0, 0)
                    break
                case "week":
                    filterDate.setDate(now.getDate() - 7)
                    break
                case "month":
                    filterDate.setMonth(now.getMonth() - 1)
                    break
                case "quarter":
                    filterDate.setMonth(now.getMonth() - 3)
                    break
            }

            results = results.filter((doc) => {
                // This is a simplified date comparison - in a real app you'd parse the actual dates
                return true // For now, return all results
            })
        }

        return results
    }

    filterByCategory(category: string): Document[] {
        if (category === "all") return this.documents
        return this.documents.filter((doc) => doc.category.toLowerCase().replace(" ", "-") === category)
    }

    filterByTag(tagId: string): Document[] {
        return this.documents.filter((doc) => doc.tags.some((tag) => tag.id === tagId))
    }

    filterByPriority(priority: "low" | "medium" | "high"): Document[] {
        return this.documents.filter((doc) => doc.priority === priority)
    }

    private getMockDocuments(): Document[] {
        return [
            {
                id: "1",
                title: "Q4 Marketing Strategy Meeting Notes",
                category: "Meeting Notes",
                lastModified: "2 hours ago",
                collaborators: 4,
                isShared: true,
                tags: [this.tags[2], this.tags[0]], // review, urgent
                priority: "high",
                description: "Strategic planning session for Q4 marketing initiatives",
            },
            {
                id: "2",
                title: "Product Roadmap 2024",
                category: "Technical Docs",
                lastModified: "1 day ago",
                collaborators: 8,
                isShared: true,
                tags: [this.tags[1]], // draft
                priority: "medium",
                description: "Comprehensive product development roadmap",
            },
            {
                id: "3",
                title: "Client Proposal - Acme Corp",
                category: "Proposals",
                lastModified: "3 days ago",
                collaborators: 2,
                isShared: true,
                tags: [this.tags[3]], // approved
                priority: "high",
                description: "Project proposal for Acme Corporation partnership",
            },
            {
                id: "4",
                title: "Weekly Team Standup Notes",
                category: "Meeting Notes",
                lastModified: "5 days ago",
                collaborators: 6,
                isShared: true,
                tags: [this.tags[5]], // template
                priority: "low",
                description: "Regular team standup meeting template",
            },
            {
                id: "5",
                title: "API Documentation v2.0",
                category: "Technical Docs",
                lastModified: "1 week ago",
                collaborators: 3,
                isShared: false,
                tags: [this.tags[2]], // review
                priority: "medium",
                description: "Updated API documentation for version 2.0",
            },
            {
                id: "6",
                title: "Monthly Performance Report",
                category: "Reports",
                lastModified: "2 weeks ago",
                collaborators: 5,
                isShared: true,
                tags: [this.tags[4]], // archived
                priority: "low",
                description: "Monthly team and project performance analysis",
            },
        ]
    }
}
