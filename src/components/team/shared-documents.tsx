"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Users, Eye, Edit, Share, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SharedDocument {
  id: string
  title: string
  category: string
  sharedWith: number
  permissions: "view" | "edit" | "admin"
  lastModified: string
  owner: {
    name: string
    avatar?: string
  }
  collaborators: Array<{
    name: string
    avatar?: string
  }>
}

const mockSharedDocs: SharedDocument[] = [
  {
    id: "1",
    title: "Q4 Marketing Strategy Meeting Notes",
    category: "Meeting Notes",
    sharedWith: 8,
    permissions: "edit",
    lastModified: "2 hours ago",
    owner: { name: "Sarah Wilson" },
    collaborators: [{ name: "John Doe" }, { name: "Mike Johnson" }, { name: "Emily Chen" }],
  },
  {
    id: "2",
    title: "Product Roadmap 2024",
    category: "Technical Docs",
    sharedWith: 12,
    permissions: "view",
    lastModified: "1 day ago",
    owner: { name: "John Doe" },
    collaborators: [{ name: "Sarah Wilson" }, { name: "Mike Johnson" }],
  },
  {
    id: "3",
    title: "Client Proposal - Acme Corp",
    category: "Proposals",
    sharedWith: 4,
    permissions: "admin",
    lastModified: "3 days ago",
    owner: { name: "Emily Chen" },
    collaborators: [{ name: "John Doe" }, { name: "Sarah Wilson" }],
  },
]

export function SharedDocuments() {
  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case "admin":
        return <Edit className="h-4 w-4 text-green-600" />
      case "edit":
        return <Edit className="h-4 w-4 text-blue-600" />
      case "view":
        return <Eye className="h-4 w-4 text-gray-600" />
      default:
        return <Eye className="h-4 w-4 text-gray-600" />
    }
  }

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "admin":
        return "bg-green-100 text-green-800"
      case "edit":
        return "bg-blue-100 text-blue-800"
      case "view":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share className="h-5 w-5" />
          Shared Documents ({mockSharedDocs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSharedDocs.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{doc.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {doc.category}
                      </Badge>
                      <Badge className={`text-xs ${getPermissionColor(doc.permissions)}`}>
                        <span className="flex items-center gap-1">
                          {getPermissionIcon(doc.permissions)}
                          {doc.permissions}
                        </span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={doc.owner.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{doc.owner.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>Owner: {doc.owner.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{doc.sharedWith} members</span>
                      </div>
                      <span>Modified {doc.lastModified}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {doc.collaborators.slice(0, 3).map((collaborator, index) => (
                      <Avatar key={index} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{collaborator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {doc.collaborators.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{doc.collaborators.length - 3}</span>
                      </div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Open Document
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="mr-2 h-4 w-4" />
                        Manage Sharing
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        View Collaborators
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Change Permissions
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
