import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { webhookUrl, leakDetails } = await request.json()

    if (!webhookUrl || !leakDetails) {
      return NextResponse.json({ error: "Missing required parameters: webhookUrl, leakDetails" }, { status: 400 })
    }

    // Format the leak details for Slack
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 Secret Leak Alert 🚨",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "We have detected potential secrets in your GitHub repositories that may be exposed. Please review and take appropriate action immediately.",
        },
      },
      {
        type: "divider",
      },
    ]

    // Add each leak as a section
    leakDetails.forEach((leak: any) => {
      blocks.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Repository:* ${leak.repository}\n*File:* \`${leak.file}\`\n*Secret Type:* ${leak.secretType}\n*Severity:* ${leak.severity}\n*Detected At:* ${new Date(leak.detectedAt).toLocaleString()}`,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "View on GitHub",
              emoji: true,
            },
            url: leak.url,
          },
        },
        {
          type: "divider",
        },
      )
    })

    // Add recommendations
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*What to do next:*\n• Revoke the exposed credentials immediately\n• Remove the secrets from your repository\n• Use environment variables or secret management tools instead\n• Consider adding pre-commit hooks to prevent future leaks",
      },
    })

    // Prepare the payload for Slack
    const payload = {
      blocks,
    }

    // Send to Slack webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to send to Slack: ${response.statusText}`)
    }

    return NextResponse.json({
      success: true,
      message: "Slack notification sent successfully",
    })
  } catch (error) {
    console.error("Error sending Slack notification:", error)
    return NextResponse.json({ error: "Failed to send Slack notification" }, { status: 500 })
  }
}
