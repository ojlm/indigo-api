export class PageSingleModel {

  pageIndex = 1
  pageTotal = 0
  pageSize = 20

  /**
   * return {from: , size:}
   * @param pageSize page size
   */
  toPageQuery() {
    if (this.pageIndex && this.pageIndex > 0) {
      return {
        from: (this.pageIndex - 1) * this.pageSize,
        size: this.pageSize
      }
    } else {
      return {
        from: 0, size: this.pageSize
      }
    }
  }
}
