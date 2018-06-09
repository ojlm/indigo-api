export function pageToOffsetAndLimit(page: number, limit: number = 10) {
  if (page > 0) {
    return `offset=${(page - 1) * limit}&limit=${limit}`
  } else {
    return `offset=0&limit=${limit}`
  }
}
