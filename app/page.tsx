import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Github, ShieldCheck } from "lucide-react"
import { SendEmailForm } from './components/SendEmailForm'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <ShieldCheck className="h-6 w-6" />
              <span className="font-bold">SecretSentry</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link href="/settings" className="text-sm font-medium transition-colors hover:text-primary">
                Settings
              </Link>
            </nav>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                3
              </span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Real-time Secret Leak Detection
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Protect your organization from exposed credentials in your GitHub repositories with real-time scanning
                  and alerts.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button>
                  <Github className="mr-2 h-4 w-4" />
                  Connect GitHub
                </Button>
                <Button variant="outline">View Dashboard</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Pattern-based Scanning</CardTitle>
                  <CardDescription>Detect known credential formats using regular expressions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Our system uses predefined patterns to identify common credential formats from AWS, Google Cloud,
                    Stripe, and many other service providers.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Intelligent Detection</CardTitle>
                  <CardDescription>AI-powered detection for novel credential formats</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Beyond pattern matching, our system uses entropy analysis and machine learning to identify potential
                    secrets that don't match known patterns.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Alerts</CardTitle>
                  <CardDescription>Immediate notifications when secrets are detected</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configure alerts via email, Slack, or webhooks to notify your team instantly when credentials are
                    exposed in your repositories.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8 text-center">
                Security Alert: Exposed Credentials
              </h1>
              <p className="text-center mb-8 text-muted-foreground">
                Use this form to notify developers about exposed credentials in their repositories.
              </p>
              <SendEmailForm />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 SecretSentry. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 underline-offset-4 hover:underline dark:text-gray-400"
            >
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 underline-offset-4 hover:underline dark:text-gray-400">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
