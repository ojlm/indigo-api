export const DEFAULT_SIZE = 10

/**
 * 转换为GO 接口中的页码
 * @param current 当前页
 */
export function pageToGoLimitOffset(current: number|string) {
  return pageToLimitOffset(current, true)
}

export function pageToLimitOffset(
    current: number|string, isGo: boolean = false) {
  if (typeof current === 'string') {
    try {
      current = parseInt(current, 10)
      if (current <= 0) {
        current = 1
      }
    } catch (error) {
      current = 1
    }
  } else if (typeof current === 'number') {
    if (current <= 0) {
      current = 1
    }
  } else {
    current = 1
  }
  if (isGo) {
    return {
      Limit: DEFAULT_SIZE, Offset: (current - 1) * DEFAULT_SIZE
    }
  } else {
    return {
      limit: DEFAULT_SIZE, offset: (current - 1) * DEFAULT_SIZE
    }
  }
}
