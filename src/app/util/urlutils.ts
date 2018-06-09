
/**
 * location search convert to a object
 */
export function searchToObj(searchStr?: string): Object {
  var query = searchStr || location.search.replace(/\?/, '')
  return query.split('&').reduce(function(obj, item, i) {
    if (item) {
      let splits = item.split('=')
      obj[splits[0]] = splits[1]
      return obj
    }
  }, {})
}

/**
 * {a:'a'} => ?a=a
 */
export function objToSearchStr(obj: Object): string {
  let s = '?'
  for(let k in obj) {
    if (obj[k] !== null || obj[k] !== undefined || obj[k] !== '') {
      s += `${k}=${obj[k]}&`
    }
  }
  return s.substr(0, s.length - 1)
}
