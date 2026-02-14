export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

export function isValidPhone(phone) {
  // Accepts formats: +1234567890, (123) 456-7890, 123-456-7890, etc. (7–15 digits)
  return /^\+?[\d\s\-().]{7,15}$/.test(String(phone).trim())
}

export function isNotEmpty(value) {
  return typeof value === 'string' ? value.trim().length > 0 : !!value
}
