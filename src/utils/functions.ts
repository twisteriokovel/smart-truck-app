/**
 * Format weight value with unit conversion
 * @param weight - Weight value in kg (number or string)
 * @param usetonnes - Whether to display in tonnes (default: false for kg)
 * @returns Formatted weight string with unit
 */
export function formatWeight(
  weight: number | string,
  useTonnes: boolean = false,
): string {
  const weightNum = parseFloat(weight.toString()) || 0

  if (useTonnes) {
    const tonnes = weightNum / 1000
    return `${tonnes.toFixed(2)}t`
  }

  return `${weightNum}kg`
}
