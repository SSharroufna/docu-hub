import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Users } from "lucide-react"

const recentDocs = [
  {
    title: "Q4 Marketing Strategy Meeting Notes",
    lastModified: "2 hours ago",
    collaborators: 4,
  },
  {
    title: "Product Roadmap 2024",
    lastModified: "1 day ago",
    collaborators: 8,
  },
  {
    title: "Client Proposal - Acme Corp",
    lastModified: "3 days ago",
    collaborators: 2,
  },
]

export function RecentDocuments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recently Modified
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentDocs.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-sm">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.lastModified}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {doc.collaborators}
                </div>
                <Button variant="ghost" size="sm">
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
