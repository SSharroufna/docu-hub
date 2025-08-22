import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Users, Calendar, MoreHorizontal, TagIcon, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Tag } from "@/lib/google-docs"

interface DocumentCardProps {
  title: string
  category: string
  lastModified: string
  collaborators: number
  isShared: boolean
  tags?: Tag[]
  priority?: "low" | "medium" | "high"
  description?: string
}

export function DocumentCard({
  title,
  category,
  lastModified,
  collaborators,
  isShared,
  tags = [],
  priority = "medium",
  description,
}: DocumentCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
              {description && <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {priority === "high" && <AlertCircle className={`h-4 w-4 ${getPriorityColor(priority)}`} />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Open in Google Docs</DropdownMenuItem>
                <DropdownMenuItem>Edit Category</DropdownMenuItem>
                <DropdownMenuItem>Manage Tags</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuItem>Add to favorites</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getPriorityColor(priority)}`}>
              {priority}
            </Badge>
          </div>

          {tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <TagIcon className="h-3 w-3 text-muted-foreground" />
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag.id} variant="outline" className={`text-xs ${tag.color}`}>
                  {tag.name}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {lastModified}
            </div>
            {isShared && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {collaborators}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
