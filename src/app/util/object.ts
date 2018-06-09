export function slimObject(obj: Object) {
  const o = {}
  if (obj && typeof obj === 'object') {
    for (const k in obj) {
      if ((typeof obj[k] !== 'number') && !obj[k]) {
        o[k] = undefined
      } else {
        o[k] = obj[k]
      }
    }
  }
  return o
}
