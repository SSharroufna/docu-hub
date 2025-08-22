"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, FileText, UserPlus, Edit, Share, MessageSquare } from "lucide-react"

interface ActivityItem {
  id: string
  type: "document_created" | "document_edited" | "member_joined" | "document_shared" | "comment_added"
  user: {
    name: string
    avatar?: string
  }
  document?: {
    title: string
  }
  timestamp: string
  description: string
}

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "document_edited",
    user: { name: "Sarah Wilson" },
    document: { title: "Q4 Marketing Strategy" },
    timestamp: "2 hours ago",
    description: "edited Q4 Marketing Strategy",
  },
  {
    id: "2",
    type: "member_joined",
    user: { name: "Mike Johnson" },
    timestamp: "5 hours ago",
    description: "joined the team",
  },
  {
    id: "3",
    type: "document_created",
    user: { name: "John Doe" },
    document: { title: "API Documentation v2.0" },
    timestamp: "1 day ago",
    description: "created API Documentation v2.0",
  },
  {
    id: "4",
    type: "document_shared",
    user: { name: "Emily Chen" },
    document: { title: "Client Proposal - Acme Corp" },
    timestamp: "2 days ago",
    description: "shared Client Proposal - Acme Corp with external users",
  },
  {
    id: "5",
    type: "comment_added",
    user: { name: "Sarah Wilson" },
    document: { title: "Product Roadmap 2024" },
    timestamp: "3 days ago",
    description: "added a comment to Product Roadmap 2024",
  },
]

export function TeamActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document_created":
        return <FileText className="h-4 w-4 text-green-600" />
      case "document_edited":
        return <Edit className="h-4 w-4 text-blue-600" />
      case "member_joined":
        return <UserPlus className="h-4 w-4 text-purple-600" />
      case "document_shared":
        return <Share className="h-4 w-4 text-orange-600" />
      case "comment_added":
        return <MessageSquare className="h-4 w-4 text-pink-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span> {activity.description}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
