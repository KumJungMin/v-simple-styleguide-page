export function isBoolean(type: string): boolean {
  return /boolean/i.test(type)
}

export function isNumber(type: string): boolean {
  return /number/i.test(type)
}

/**
 * TypeScript 유니언 타입 문자열에서 모든 문자열 리터럴 값을 추출합니다.
 *
 * @param type - TypeScript 유니언 타입을 나타내는 문자열입니다. 예: `'a' | 'b' | 'c'`
 * @returns 유니언 타입에서 추출된 문자열 값들의 배열을 반환합니다. 예: `['a', 'b', 'c']`
 */
export function enumValues(type: string): string[] {
  const regex = /'([^']+)'|"([^"]+)"/g
  const values: string[] = []
  let match: RegExpExecArray | null
  
  while ((match = regex.exec(type))) {
    values.push(match[1] ?? match[2])
  }
  return values
} 