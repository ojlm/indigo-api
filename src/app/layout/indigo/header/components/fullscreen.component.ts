import { Component, HostListener } from '@angular/core'
import * as screenfull from 'screenfull'

@Component({
  selector: 'header-fullscreen',
  template: `
  <i nz-icon [type]="status ? 'fullscreen-exit' : 'fullscreen'"></i>
  {{(status ? 'fullscreen-exit' : 'fullscreen') | translate }}
  `
})
export class HeaderFullScreenComponent {
  status = false

  private get sf(): screenfull.Screenfull {
    return screenfull as screenfull.Screenfull;
  }

  @HostListener('window:resize')
  _resize() {
    this.status = this.sf.isFullscreen
  }

  @HostListener('click')
  _click() {
    if (this.sf.isEnabled) {
      this.sf.toggle()
    }
  }
}
