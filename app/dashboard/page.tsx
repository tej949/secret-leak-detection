import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github } from "lucide-react"
import { LeakTable } from "@/components/leak-table"
import { StatsCards } from "@/components/stats-cards"
import { RepoList } from "@/components/repo-list"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <Github className="mr-2 h-4 w-4" />
              Scan Repositories
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leaks">Detected Leaks</TabsTrigger>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <StatsCards />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Leaks</CardTitle>
                  <CardDescription>Detected credential leaks in the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <LeakTable />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Monitored Repositories</CardTitle>
                  <CardDescription>GitHub repositories being scanned</CardDescription>
                </CardHeader>
                <CardContent>
                  <RepoList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="leaks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Detected Leaks</CardTitle>
                <CardDescription>Comprehensive list of all detected credential leaks</CardDescription>
              </CardHeader>
              <CardContent>
                <LeakTable extended={true} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="repositories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monitored Repositories</CardTitle>
                <CardDescription>GitHub repositories being scanned for secrets</CardDescription>
              </CardHeader>
              <CardContent>
                <RepoList extended={true} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you want to be notified about detected leaks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Send email alerts when secrets are detected</p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline">Configure Email</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Slack Integration</h3>
                    <p className="text-sm text-gray-500">Send alerts to a Slack channel</p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline">Connect Slack</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Webhook Notifications</h3>
                    <p className="text-sm text-gray-500">Send alerts to a custom webhook endpoint</p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline">Configure Webhook</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
