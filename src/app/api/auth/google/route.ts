import { type NextRequest, NextResponse } from "next/server"

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  console.log("[v0] OAuth flow started, code:", code ? "present" : "missing")

  if (!code) {
    // Redirect to Google OAuth
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    googleAuthUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID || "")
    googleAuthUrl.searchParams.set("redirect_uri", REDIRECT_URI)
    googleAuthUrl.searchParams.set("response_type", "code")
    googleAuthUrl.searchParams.set(
      "scope",
      "https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/userinfo.profile",
    )
    googleAuthUrl.searchParams.set("access_type", "offline")
    googleAuthUrl.searchParams.set("prompt", "consent")

    console.log("[v0] Redirecting to Google OAuth:", googleAuthUrl.toString())
    return NextResponse.redirect(googleAuthUrl.toString())
  }

  try {
    console.log("[v0] Exchanging code for tokens...")
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID || "",
        client_secret: GOOGLE_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error("[v0] Token exchange failed:", tokens)
      throw new Error(`Token exchange failed: ${tokens.error}`)
    }

    console.log("[v0] Tokens received, setting cookies and redirecting to dashboard")

    // Store tokens securely (in a real app, use a database)
    // For now, redirect to dashboard with success
    const response = NextResponse.redirect(new URL("/dashboard", request.url))
    response.cookies.set("google_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokens.expires_in,
    })

    if (tokens.refresh_token) {
      response.cookies.set("google_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return response
  } catch (error) {
    console.error("[v0] Google OAuth error:", error)
    return NextResponse.redirect(new URL("/auth?error=oauth_failed", request.url))
  }
}
