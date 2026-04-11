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
