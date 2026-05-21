export function parsePostcode(raw: string): string {
  const cleaned = raw.replace(/\s+/g, '').toUpperCase()
  // Insert space before last 3 chars
  if (cleaned.length >= 5) {
    return cleaned.slice(0, -3) + ' ' + cleaned.slice(-3)
  }
  return cleaned
}

export function isValidUKPostcode(postcode: string): boolean {
  const re = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i
  return re.test(postcode.trim())
}
