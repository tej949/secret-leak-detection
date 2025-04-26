"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, Clock, ExternalLink, Eye, EyeOff } from "lucide-react"

interface LeakTableProps {
  extended?: boolean
}

export function LeakTable({ extended = false }: LeakTableProps) {
  const [showSecrets, setShowSecrets] = useState(false)

  // Mock data for demonstration
  const leaks = [
    {
      id: "1",
      repository: "company/api-service",
      file: "config/production.js",
      secretType: "AWS Access Key",
      secretValue: "AKIA1234567890ABCDEF",
      detectedAt: "2025-04-25T10:30:00Z",
      status: "open",
      severity: "high",
    },
    {
      id: "2",
      repository: "company/web-frontend",
      file: "src/services/api.js",
      secretType: "API Key",
      secretValue: "sk_test_1234567890abcdefghijklmnopqrstuvwxyz",
      detectedAt: "2025-04-24T14:15:00Z",
      status: "resolved",
      severity: "medium",
    },
    {
      id: "3",
      repository: "company/data-processor",
      file: "scripts/init.py",
      secretType: "Database Password",
      secretValue: "p@ssw0rd123!",
      detectedAt: "2025-04-23T09:45:00Z",
      status: "investigating",
      severity: "critical",
    },
    {
      id: "4",
      repository: "company/mobile-app",
      file: "android/app/src/main/java/com/company/app/Config.java",
      secretType: "OAuth Client Secret",
      secretValue: "client_secret_1234567890abcdefghijklmnopqrstuvwxyz",
      detectedAt: "2025-04-22T16:20:00Z",
      status: "open",
      severity: "high",
    },
    {
      id: "5",
      repository: "company/internal-tools",
      file: "config/settings.json",
      secretType: "JWT Secret",
      secretValue: "jwt_secret_key_very_long_and_secure_1234567890",
      detectedAt: "2025-04-21T11:10:00Z",
      status: "resolved",
      severity: "medium",
    },
  ]

  const displayedLeaks = extended ? leaks : leaks.slice(0, 3)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "investigating":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const maskSecret = (secret: string) => {
    if (!showSecrets) {
      return "••••••••••••••••••••"
    }
    return secret
  }

  return (
    <div className="space-y-4">
      {extended && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setShowSecrets(!showSecrets)}>
            {showSecrets ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Secrets
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Secrets
              </>
            )}
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Repository</TableHead>
            <TableHead>Secret Type</TableHead>
            {extended && <TableHead>File</TableHead>}
            {extended && <TableHead>Secret Value</TableHead>}
            <TableHead>Detected</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Severity</TableHead>
            {extended && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedLeaks.map((leak) => (
            <TableRow key={leak.id}>
              <TableCell className="font-medium">{leak.repository}</TableCell>
              <TableCell>{leak.secretType}</TableCell>
              {extended && <TableCell className="font-mono text-xs">{leak.file}</TableCell>}
              {extended && (
                <TableCell>
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{maskSecret(leak.secretValue)}</code>
                </TableCell>
              )}
              <TableCell>{formatDate(leak.detectedAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(leak.status)}
                  <span className="capitalize">{leak.status}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${getSeverityColor(leak.severity)} text-white`}>{leak.severity}</Badge>
              </TableCell>
              {extended && (
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
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
            View All Leaks
          </Button>
        </div>
      )}
    </div>
  )
}
