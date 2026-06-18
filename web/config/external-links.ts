const POLAR_CUSTOMER_PORTAL_REQUEST_BASE =
  'https://polar.sh/riyosms/portal/request'

export function polarCustomerPortalRequestUrl(
  email?: string | null
): string {
  const trimmed = email?.trim()
  if (!trimmed) return POLAR_CUSTOMER_PORTAL_REQUEST_BASE
  return `${POLAR_CUSTOMER_PORTAL_REQUEST_BASE}?email=${encodeURIComponent(trimmed)}`
}

export const ExternalLinks = {
  patreon: 'https://riyosms.com',
  github: 'https://github.com/riyosms/riyosms',
  discord: 'https://discord.gg/d7vyfBpWbQ',
  polar: 'https://donate.riyosms.com',
  twitter: 'https://x.com/riyosmsdotdev',
  linkedin: 'https://www.linkedin.com/company/riyosmsdotdev',
}
