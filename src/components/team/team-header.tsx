"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Settings, UserPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function TeamHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Team Workspace</h1>
                <p className="text-muted-foreground">Manage your team and collaborate on documents</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="px-3 py-1">
              Pro Plan
            </Badge>
            <Button size="sm" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Members
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
