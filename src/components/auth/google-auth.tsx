"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome } from "lucide-react"

export function GoogleAuth() {
  const handleGoogleSignIn = async () => {
    window.location.href = "/api/auth/google"
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to DocuHub</CardTitle>
        <CardDescription>Connect your Google account to start organizing your documents</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleGoogleSignIn} className="w-full flex items-center gap-2" size="lg">
          <Chrome className="h-5 w-5" />
          Continue with Google
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-4">
          We'll only access your Google Docs with your permission
        </p>
      </CardContent>
    </Card>
  )
}
