import { NextResponse } from "next/server"
import { Octokit } from "@octokit/rest"

// Secret detection patterns
const SECRET_PATTERNS = {
  AWS_ACCESS_KEY: /AKIA[0-9A-Z]{16}/g,
  AWS_SECRET_KEY: /[0-9a-zA-Z/+]{40}/g,
  GITHUB_TOKEN: /gh[pousr]_[0-9a-zA-Z]{36}/g,
  GOOGLE_API_KEY: /AIza[0-9A-Za-z-_]{35}/g,
  STRIPE_API_KEY: /sk_live_[0-9a-zA-Z]{24}/g,
  STRIPE_PUBLISHABLE_KEY: /pk_live_[0-9a-zA-Z]{24}/g,
  GENERIC_API_KEY: /api[_-]?key["':\s]*([0-9a-zA-Z]{16,64})/gi,
  GENERIC_SECRET: /secret["':\s]*([0-9a-zA-Z]{16,64})/gi,
  GENERIC_PASSWORD: /password["':\s]*([0-9a-zA-Z]{8,64})/gi,
  PRIVATE_KEY: /-----BEGIN PRIVATE KEY-----[^-]*-----END PRIVATE KEY-----/g,
  RSA_PRIVATE_KEY: /-----BEGIN RSA PRIVATE KEY-----[^-]*-----END RSA PRIVATE KEY-----/g,
}

// Function to detect secrets in content
function detectSecrets(content: string, filePath: string) {
  const detectedSecrets = []

  for (const [secretType, pattern] of Object.entries(SECRET_PATTERNS)) {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      detectedSecrets.push({
        secretType,
        secretValue: match[0],
        filePath,
        lineNumber: getLineNumber(content, match.index || 0),
      })
    }
  }

  return detectedSecrets
}

// Helper function to get line number from content and index
function getLineNumber(content: string, index: number) {
  const lines = content.substring(0, index).split("\n")
  return lines.length
}

// Function to scan a repository
async function scanRepository(octokit: Octokit, owner: string, repo: string, branch = "main") {
  try {
    // Get repository contents
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: "",
      ref: branch,
    })

    const detectedSecrets = []

    // Process files recursively
    await processContents(octokit, owner, repo, contents, branch, detectedSecrets)

    return detectedSecrets
  } catch (error) {
    console.error("Error scanning repository:", error)
    throw error
  }
}

// Process repository contents recursively
async function processContents(
  octokit: Octokit,
  owner: string,
  repo: string,
  contents: any[],
  branch: string,
  detectedSecrets: any[],
) {
  for (const item of contents) {
    if (item.type === "dir") {
      // Get directory contents
      const { data: dirContents } = await octokit.repos.getContent({
        owner,
        repo,
        path: item.path,
        ref: branch,
      })

      // Process directory contents recursively
      await processContents(octokit, owner, repo, dirContents, branch, detectedSecrets)
    } else if (item.type === "file") {
      // Skip binary files and large files
      if (
        item.size > 1000000 || // Skip files larger than 1MB
        /\.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot|mp3|mp4|avi|mov|pdf|zip|tar|gz|bin)$/i.test(item.name)
      ) {
        continue
      }

      try {
        // Get file content
        const { data: fileData } = await octokit.repos.getContent({
          owner,
          repo,
          path: item.path,
          ref: branch,
        })

        if (fileData.encoding === "base64" && fileData.content) {
          const content = Buffer.from(fileData.content, "base64").toString("utf-8")

          // Detect secrets in file content
          const secrets = detectSecrets(content, item.path)

          if (secrets.length > 0) {
            detectedSecrets.push({
              file: item.path,
              url: item.html_url,
              secrets,
            })
          }
        }
      } catch (error) {
        console.error(`Error processing file ${item.path}:`, error)
      }
    }
  }
}

export async function POST(request: Request) {
  try {
    const { token, owner, repo, branch = "main" } = await request.json()

    if (!token || !owner || !repo) {
      return NextResponse.json({ error: "Missing required parameters: token, owner, repo" }, { status: 400 })
    }

    // Initialize Octokit with the provided token
    const octokit = new Octokit({ auth: token })

    // Scan repository for secrets
    const detectedSecrets = await scanRepository(octokit, owner, repo, branch)

    return NextResponse.json({
      repository: `${owner}/${repo}`,
      branch,
      scannedAt: new Date().toISOString(),
      detectedSecrets,
    })
  } catch (error) {
    console.error("Error in scan route:", error)
    return NextResponse.json({ error: "Failed to scan repository" }, { status: 500 })
  }
}
