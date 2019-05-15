/**
 * 123: number => 123: number
 * "123": string => 123: number
 * '"123"': string => 123: string
 */
export function intputNumFormat(value: string | number) {
  let newValue: any = value
  if (value) {
    const num = Number(value)
    if (isNaN(num)) { // string
      value = value as string
      if (value.startsWith('"') && value.endsWith('"')) { // check if a number string like : "123"
        const trim = value.substring(1, value.length - 1)
        if (isNaN(Number(trim))) { // not number
          newValue = value
        } else { // number string
          newValue = trim
        }
      } else {
        newValue = value
      }
    } else {  // number
      newValue = num
    }
  }
  return newValue
}

/**
 * 123: number => 123: number
 * "123" : string => ""123"": string
 */
export function numToInputValue(value: string | number) {
  let newValue = value
  if (typeof value === 'string') { // check if it is a string number
    if (!isNaN(Number(value))) {
      newValue = `"${value}"`
    }
  }
  return newValue
}
