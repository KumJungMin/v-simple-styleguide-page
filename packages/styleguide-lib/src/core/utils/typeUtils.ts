export function isBoolean(type: string): boolean {
  return /boolean/i.test(type)
}

export function isNumber(type: string): boolean {
  return /number/i.test(type)
}

export function enumValues(type: string): string[] {
  const regex = /'([^']+)'|"([^"]+)"/g
  const values: string[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(type))) {
    values.push(match[1] ?? match[2])
  }
  return values
} 