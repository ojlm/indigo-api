import jsonpath from 'jsonpath/jsonpath.min'

export function getJsonPathValueAsString(path: string, data: any) {
  try {
    const array = jsonpath.query(data, path)
    if (array.length > 0) {
      return array[0].toString()
    } else {
      return ''
    }
  } catch (e) {
    return e.toString()
  }
}
