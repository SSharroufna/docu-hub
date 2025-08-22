"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  FileText,
  Calendar,
  Users,
  Star,
  Archive,
  Trash2,
  Presentation as PresentationChart,
  ClipboardList,
  BookOpen,
  UserCheck,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const categories = [
  { name: "All Documents", icon: FileText, count: 24, active: true },
  { name: "Recent", icon: Clock, count: 8 },
  { name: "Starred", icon: Star, count: 5 },
  { name: "Shared with me", icon: Users, count: 12 },
]

const documentTypes = [
  { name: "Meeting Notes", icon: Calendar, count: 8, color: "bg-blue-100 text-blue-800" },
  { name: "Proposals", icon: PresentationChart, count: 4, color: "bg-green-100 text-green-800" },
  { name: "Reports", icon: ClipboardList, count: 6, color: "bg-purple-100 text-purple-800" },
  { name: "Technical Docs", icon: BookOpen, count: 6, color: "bg-orange-100 text-orange-800" },
]

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  )
}

export function DashboardSidebar() {
  const [activeCategory, setActiveCategory] = useState("All Documents")

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-6 space-y-6">
        {/* Main Categories */}
        <div>
          <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Documents</h3>
          <nav className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.name}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    activeCategory === category.name && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                  onClick={() => setActiveCategory(category.name)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-auto">
                    {category.count}
                  </Badge>
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Document Types */}
        <div>
          <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Categories</h3>
          <nav className="space-y-1">
            {documentTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.name}
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {type.name}
                  <Badge variant="secondary" className="ml-auto">
                    {type.count}
                  </Badge>
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Team Section */}
        <div>
          <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Team</h3>
          <nav className="space-y-1">
            <Link href="/team">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <UserCheck className="mr-3 h-4 w-4" />
                Team Management
              </Button>
            </Link>
          </nav>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Quick Actions</h3>
          <nav className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Archive className="mr-3 h-4 w-4" />
              Archived
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Trash2 className="mr-3 h-4 w-4" />
              Trash
            </Button>
          </nav>
        </div>
      </div>
    </aside>
  )
}
