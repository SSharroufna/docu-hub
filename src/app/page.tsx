import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Search, Tag, Calendar, Shield } from "lucide-react"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-primary" />
                            <h1 className="text-2xl font-bold text-foreground">DocuHub</h1>
                        </div>
                        <Button>Sign in with Google</Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center max-w-4xl">
                    <h2 className="text-5xl font-bold text-foreground mb-6">One place to organize your team's Google Docs</h2>
                    <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                        Connect directly to your Google Docs to centralize, categorize, and manage your documents in one clean,
                        searchable interface — without changing your workflow.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" className="px-8">
                            Get Started Free
                        </Button>
                        <Button variant="outline" size="lg" className="px-8 bg-transparent">
                            Watch Demo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-4 bg-muted/30">
                <div className="container mx-auto max-w-6xl">
                    <h3 className="text-3xl font-bold text-center text-foreground mb-12">
                        Everything you need to manage team documents
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <FileText className="h-10 w-10 text-primary mb-2" />
                                <CardTitle>Google Docs Integration</CardTitle>
                                <CardDescription>
                                    Connect directly to your Google Docs via API to fetch and manage documents seamlessly
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Tag className="h-10 w-10 text-primary mb-2" />
                                <CardTitle>Smart Categorization</CardTitle>
                                <CardDescription>
                                    Auto-organize docs by categories like meeting notes, proposals, reports, and technical docs
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Search className="h-10 w-10 text-primary mb-2" />
                                <CardTitle>Powerful Search</CardTitle>
                                <CardDescription>
                                    Smart search across all connected documents with tagging and labeling system
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Users className="h-10 w-10 text-primary mb-2" />
                                <CardTitle>Team Dashboards</CardTitle>
                                <CardDescription>
                                    Track recent updates, new files, and pinned documents across your team
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Calendar className="h-10 w-10 text-primary mb-2" />
                                <CardTitle>Meeting Integration</CardTitle>
                                <CardDescription>
                                    Host and record meetings with auto-created meeting notes saved as Google Docs
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Shield className="h-10 w-10 text-primary mb-2" />
                                <CardTitle>Secure Access</CardTitle>
                                <CardDescription>
                                    Access permissions integrated with Google account roles for secure collaboration
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center max-w-3xl">
                    <h3 className="text-3xl font-bold text-foreground mb-6">Ready to organize your team's documents?</h3>
                    <p className="text-lg text-muted-foreground mb-8">
                        Start centralizing your Google Docs today. No setup required, just connect and organize.
                    </p>
                    <Button size="lg" className="px-8">
                        Start Free Trial
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-card py-8 px-4">
                <div className="container mx-auto text-center">
                    <p className="text-muted-foreground">© 2024 DocuHub. Built for teams who love Google Docs.</p>
                </div>
            </footer>
        </div>
    )
}
