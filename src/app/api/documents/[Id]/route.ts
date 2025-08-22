import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const accessToken = request.cookies.get("google_access_token")?.value

        if (!accessToken) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const documentId = params.id

        // Fetch document details from Google Docs API
        const [docResponse, driveResponse] = await Promise.all([
            fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
            fetch(
                `https://www.googleapis.com/drive/v3/files/${documentId}?fields=id,name,mimeType,modifiedTime,owners,permissions,webViewLink`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            ),
        ])

        if (!docResponse.ok || !driveResponse.ok) {
            throw new Error("Failed to fetch document details")
        }

        const docData = await docResponse.json()
        const driveData = await driveResponse.json()

        // Extract text content from the document
        const content = extractTextFromDocument(docData)

        return NextResponse.json({
            id: documentId,
            title: driveData.name,
            content,
            lastModified: new Date(driveData.modifiedTime).toLocaleDateString(),
            webViewLink: driveData.webViewLink,
            owner: driveData.owners?.[0]?.displayName || "Unknown",
        })
    } catch (error) {
        console.error("Error fetching document:", error)
        return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 })
    }
}

function extractTextFromDocument(doc: any): string {
    let text = ""

    if (doc.body && doc.body.content) {
        for (const element of doc.body.content) {
            if (element.paragraph) {
                for (const textElement of element.paragraph.elements || []) {
                    if (textElement.textRun) {
                        text += textElement.textRun.content
                    }
                }
            }
        }
    }

    return text
}
