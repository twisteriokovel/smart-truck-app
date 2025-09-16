export const VALIDATION_PATTERNS = {
  NUMERIC: /^[0-9]+([.,][0-9]+)?$/,
} as const

export function isNumericString(value: string): boolean {
  if (!value) return false
  return VALIDATION_PATTERNS.NUMERIC.test(value.trim())
}

export const VALIDATION_TESTS = {
  required: (value: any) => {
    if (value === null || value === undefined) return false
    const stringValue = String(value)
    return Boolean(stringValue.trim())
  },
  numeric: (value: any) => {
    if (value === null || value === undefined) return false
    const stringValue = String(value)
    return isNumericString(stringValue)
  },
} as const
