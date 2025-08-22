import { type NextRequest, NextResponse } from "next/server"

interface GoogleDocument {
    id: string
    name: string
    mimeType: string
    modifiedTime: string
    owners: Array<{ displayName: string; emailAddress: string }>
    permissions: Array<{ role: string; type: string }>
    webViewLink: string
}

export async function GET(request: NextRequest) {
    try {
        const accessToken = request.cookies.get("google_access_token")?.value

        console.log("[v0] Checking for access token:", accessToken ? "present" : "missing")

        if (!accessToken) {
            console.log("[v0] No access token found, user not authenticated")
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        console.log("[v0] Fetching documents from Google Drive API...")

        // Fetch Google Docs from Drive API
        const response = await fetch(
            "https://www.googleapis.com/drive/v3/files?" +
            new URLSearchParams({
                q: "mimeType='application/vnd.google-apps.document'",
                fields: "files(id,name,mimeType,modifiedTime,owners,permissions,webViewLink)",
                orderBy: "modifiedTime desc",
                pageSize: "50",
            }),
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error("[v0] Google API error:", response.status, errorText)
            throw new Error(`Google API error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log("[v0] Successfully fetched", data.files?.length || 0, "documents")

        // Transform the data to match our document structure
        const documents = data.files.map((file: GoogleDocument) => ({
            id: file.id,
            title: file.name,
            lastModified: new Date(file.modifiedTime).toLocaleDateString(),
            collaborators: file.permissions?.length || 1,
            isShared: file.permissions?.some((p) => p.type === "user" && p.role !== "owner") || false,
            category: categorizeDocument(file.name),
            webViewLink: file.webViewLink,
            owner: file.owners?.[0]?.displayName || "Unknown",
        }))

        return NextResponse.json({ documents })
    } catch (error) {
        console.error("[v0] Error fetching documents:", error)
        return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
    }
}

function categorizeDocument(title: string): string {
    const lowerTitle = title.toLowerCase()

    if (lowerTitle.includes("meeting") || lowerTitle.includes("standup") || lowerTitle.includes("notes")) {
        return "Meeting Notes"
    }
    if (lowerTitle.includes("proposal") || lowerTitle.includes("pitch")) {
        return "Proposals"
    }
    if (lowerTitle.includes("report") || lowerTitle.includes("analysis")) {
        return "Reports"
    }
    if (lowerTitle.includes("api") || lowerTitle.includes("technical") || lowerTitle.includes("doc")) {
        return "Technical Docs"
    }

    return "General"
}
