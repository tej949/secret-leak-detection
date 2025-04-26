// Common patterns for detecting secrets in code
export const SECRET_PATTERNS = {
  // AWS
  AWS_ACCESS_KEY: {
    pattern: /AKIA[0-9A-Z]{16}/g,
    description: "AWS Access Key ID",
    severity: "high",
  },
  AWS_SECRET_KEY: {
    pattern: /[0-9a-zA-Z/+]{40}/g,
    description: "AWS Secret Access Key",
    severity: "critical",
  },

  // GitHub
  GITHUB_TOKEN: {
    pattern: /gh[pousr]_[0-9a-zA-Z]{36}/g,
    description: "GitHub Personal Access Token",
    severity: "high",
  },

  // Google
  GOOGLE_API_KEY: {
    pattern: /AIza[0-9A-Za-z-_]{35}/g,
    description: "Google API Key",
    severity: "high",
  },

  // Stripe
  STRIPE_API_KEY: {
    pattern: /sk_live_[0-9a-zA-Z]{24}/g,
    description: "Stripe Secret Key",
    severity: "critical",
  },
  STRIPE_PUBLISHABLE_KEY: {
    pattern: /pk_live_[0-9a-zA-Z]{24}/g,
    description: "Stripe Publishable Key",
    severity: "medium",
  },

  // Generic patterns
  GENERIC_API_KEY: {
    pattern: /api[_-]?key["':\s]*([0-9a-zA-Z]{16,64})/gi,
    description: "Generic API Key",
    severity: "medium",
  },
  GENERIC_SECRET: {
    pattern: /secret["':\s]*([0-9a-zA-Z]{16,64})/gi,
    description: "Generic Secret",
    severity: "medium",
  },
  GENERIC_PASSWORD: {
    pattern: /password["':\s]*([0-9a-zA-Z]{8,64})/gi,
    description: "Password",
    severity: "medium",
  },

  // Private keys
  PRIVATE_KEY: {
    pattern: /-----BEGIN PRIVATE KEY-----[^-]*-----END PRIVATE KEY-----/g,
    description: "Private Key",
    severity: "critical",
  },
  RSA_PRIVATE_KEY: {
    pattern: /-----BEGIN RSA PRIVATE KEY-----[^-]*-----END RSA PRIVATE KEY-----/g,
    description: "RSA Private Key",
    severity: "critical",
  },

  // Database connection strings
  DATABASE_URL: {
    pattern: /postgres:\/\/[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+:[0-9]+\/[a-zA-Z0-9_-]+/g,
    description: "PostgreSQL Connection String",
    severity: "high",
  },
  MONGODB_URI: {
    pattern: /mongodb(\+srv)?:\/\/[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+@[a-zA-Z0-9_.-]+/g,
    description: "MongoDB Connection String",
    severity: "high",
  },

  // JWT tokens
  JWT_TOKEN: {
    pattern: /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
    description: "JWT Token",
    severity: "medium",
  },
}

// Function to detect secrets in content
export function detectSecrets(content: string, filePath: string) {
  const detectedSecrets = []

  for (const [secretType, config] of Object.entries(SECRET_PATTERNS)) {
    const { pattern, description, severity } = config as {
      pattern: RegExp
      description: string
      severity: string
    }

    const matches = Array.from(content.matchAll(pattern))

    for (const match of matches) {
      detectedSecrets.push({
        secretType,
        description,
        secretValue: match[0],
        filePath,
        lineNumber: getLineNumber(content, match.index || 0),
        severity,
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

// Function to calculate entropy of a string (useful for detecting random strings that might be secrets)
export function calculateEntropy(str: string) {
  const len = str.length
  const charCounts: Record<string, number> = {}

  // Count occurrences of each character
  for (let i = 0; i < len; i++) {
    const char = str[i]
    charCounts[char] = (charCounts[char] || 0) + 1
  }

  // Calculate entropy
  let entropy = 0
  for (const count of Object.values(charCounts)) {
    const p = count / len
    entropy -= p * Math.log2(p)
  }

  return entropy
}

// Function to check if a string might be a high-entropy secret
export function isHighEntropyString(str: string, threshold = 3.5) {
  // Ignore strings that are too short
  if (str.length < 8) return false

  const entropy = calculateEntropy(str)
  return entropy > threshold
}
