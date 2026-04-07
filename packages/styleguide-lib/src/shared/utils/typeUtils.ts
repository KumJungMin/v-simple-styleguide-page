/**
 * Flow:
 * 1. Read the type string written in the component docs.
 * 2. Detect primitive kinds that affect the playground UI.
 * 3. Extract string literal options when a prop behaves like an enum.
 */
export function isBooleanType(typeName: string): boolean {
  return /boolean/i.test(typeName)
}

export function isNumberType(typeName: string): boolean {
  return /number/i.test(typeName)
}

export function extractStringLiteralOptions(typeName: string): string[] {
  const stringLiteralPattern = /'([^']+)'|"([^"]+)"/g
  const extractedOptions: string[] = []
  let currentMatch: RegExpExecArray | null

  while ((currentMatch = stringLiteralPattern.exec(typeName))) {
    extractedOptions.push(currentMatch[1] ?? currentMatch[2])
  }

  return extractedOptions
}

export const isBoolean = isBooleanType
export const isNumber = isNumberType
export const enumValues = extractStringLiteralOptions
