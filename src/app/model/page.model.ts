export class PageSingleModel {

  pageIndex = 1
  pageTotal = 0

  /**
   * return {from: , size:}
   * @param pageSize page size
   */
  toPageQuery(pageSize = 20) {
    if (this.pageIndex && this.pageIndex > 0) {
      return {
        from: (this.pageIndex - 1) * pageSize,
        size: pageSize
      }
    } else {
      return {
        from: 0, size: pageSize
      }
    }
  }
}
