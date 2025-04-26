"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Github, Settings } from "lucide-react"

interface RepoListProps {
  extended?: boolean
}

export function RepoList({ extended = false }: RepoListProps) {
  // Mock data for demonstration
  const repositories = [
    {
      id: "1",
      name: "company/api-service",
      lastScanned: "2025-04-25T10:30:00Z",
      status: "active",
      leaksDetected: 3,
      branch: "main",
    },
    {
      id: "2",
      name: "company/web-frontend",
      lastScanned: "2025-04-24T14:15:00Z",
      status: "active",
      leaksDetected: 1,
      branch: "main",
    },
    {
      id: "3",
      name: "company/data-processor",
      lastScanned: "2025-04-23T09:45:00Z",
      status: "active",
      leaksDetected: 2,
      branch: "develop",
    },
    {
      id: "4",
      name: "company/mobile-app",
      lastScanned: "2025-04-22T16:20:00Z",
      status: "active",
      leaksDetected: 1,
      branch: "main",
    },
    {
      id: "5",
      name: "company/internal-tools",
      lastScanned: "2025-04-21T11:10:00Z",
      status: "paused",
      leaksDetected: 0,
      branch: "main",
    },
  ]

  const displayedRepos = extended ? repositories : repositories.slice(0, 3)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Repository</TableHead>
            <TableHead>Last Scanned</TableHead>
            {extended && <TableHead>Branch</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Leaks</TableHead>
            {extended && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedRepos.map((repo) => (
            <TableRow key={repo.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  {repo.name}
                </div>
              </TableCell>
              <TableCell>{formatDate(repo.lastScanned)}</TableCell>
              {extended && <TableCell>{repo.branch}</TableCell>}
              <TableCell>
                <Badge variant={repo.status === "active" ? "default" : "secondary"}>{repo.status}</Badge>
              </TableCell>
              <TableCell>
                {repo.leaksDetected > 0 ? (
                  <Badge variant="destructive">{repo.leaksDetected}</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    0
                  </Badge>
                )}
              </TableCell>
              {extended && (
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!extended && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm">
            View All Repositories
          </Button>
        </div>
      )}
    </div>
  )
}
