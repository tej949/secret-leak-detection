import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { to, subject, leakDetails } = await request.json()

    if (!to || !subject || !leakDetails) {
      return NextResponse.json({ error: "Missing required parameters: to, subject, leakDetails" }, { status: 400 })
    }

    // Create email transporter
    // Note: In production, you would use environment variables for these credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "user@example.com",
        pass: process.env.SMTP_PASSWORD || "password",
      },
    })

    // Format the leak details for the email
    const leakInfo = leakDetails
      .map((leak: any) => {
        return `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #e53e3e;">Secret Detected in ${leak.repository}</h3>
          <p><strong>File:</strong> ${leak.file}</p>
          <p><strong>Secret Type:</strong> ${leak.secretType}</p>
          <p><strong>Detected At:</strong> ${new Date(leak.detectedAt).toLocaleString()}</p>
          <p><strong>Severity:</strong> ${leak.severity}</p>
          <p><a href="${leak.url}" style="color: #3182ce;">View on GitHub</a></p>
        </div>
      `
      })
      .join("")

    // Compose email
    const mailOptions = {
      from: process.env.SMTP_FROM || "secretsentry@example.com",
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-bottom: 3px solid #3182ce;">
            <h1 style="margin: 0; color: #1e293b;">Secret Leak Alert</h1>
          </div>
          <div style="padding: 20px;">
            <p>We have detected potential secrets in your GitHub repositories that may be exposed. Please review and take appropriate action immediately.</p>
            
            <h2 style="color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Detected Secrets</h2>
            ${leakInfo}
            
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin-top: 0;"><strong>What to do next:</strong></p>
              <ol style="margin-bottom: 0;">
                <li>Revoke the exposed credentials immediately</li>
                <li>Remove the secrets from your repository</li>
                <li>Use environment variables or secret management tools instead</li>
                <li>Consider adding pre-commit hooks to prevent future leaks</li>
              </ol>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
            <p>This is an automated alert from SecretSentry. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: "Email notification sent successfully",
    })
  } catch (error) {
    console.error("Error sending email notification:", error)
    return NextResponse.json({ error: "Failed to send email notification" }, { status: 500 })
  }
}
