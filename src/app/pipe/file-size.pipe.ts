import { DecimalPipe } from '@angular/common'
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core'

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | filesize:precision
 * Example:
 *   {{ 1024 |  filesize}}
 *   formats to: 1 KB
*/
@Pipe({ name: 'filesize' })
export class FilesizePipe implements PipeTransform {

  deciPipe: DecimalPipe

  private units = [
    ' B',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ]

  constructor(@Inject(LOCALE_ID) localeId) {
    this.deciPipe = new DecimalPipe(localeId)
  }

  transform(bytes: number = 0, precision: number = 2): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) { return '?' }
    if (bytes < 1024) {
      return bytes + ' ' + this.units[0]
    }
    let unit = 0
    while (bytes >= 1024) {
      bytes /= 1024
      unit++
    }
    if (unit === 0) {
      precision = 0
    }
    return this.deciPipe.transform(bytes, '1.1-' + precision) + ' ' + this.units[unit]
  }
}
