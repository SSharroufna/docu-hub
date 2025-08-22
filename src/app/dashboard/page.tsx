"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DocumentGrid } from "@/components/dashboard/document-grid"
import { RecentDocuments } from "@/components/dashboard/recent-documents"
import { CategoryManager } from "@/components/dashboard/category-manager"

export default function DashboardPage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [userInfo, setUserInfo] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/check")
                if (response.ok) {
                    const data = await response.json()
                    setIsAuthenticated(data.authenticated)
                    setUserInfo(data.user)
                } else {
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error("Auth check failed:", error)
                setIsAuthenticated(false)
            }
        }

        checkAuth()
    }, [])

    useEffect(() => {
        if (isAuthenticated === false) {
            router.push("/auth")
        }
    }, [isAuthenticated, router])

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <div className="flex">
                <DashboardSidebar />
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">My Documents</h1>
                                <p className="text-muted-foreground">
                                    {userInfo?.name ? `Welcome back, ${userInfo.name}!` : "Organize and manage your Google Docs"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-3 space-y-6">
                                <RecentDocuments />
                                <DocumentGrid />
                            </div>
                            <div className="space-y-6">
                                <CategoryManager />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
