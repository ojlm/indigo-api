import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core'

import { removeWindowSelection } from '../ui.model'

@Component({
  selector: 'app-ui-file-container',
  templateUrl: './ui-file-container.component.html',
  styleUrls: ['./ui-file-container.component.css']
})
export class UiFileContainerComponent implements OnInit, AfterViewInit {

  minWidth = 264
  maxWidth = window.innerWidth / 2 - 80
  width = 264
  @ViewChild('drag') drag: ElementRef
  height = window.innerHeight

  @HostListener('window:resize')
  resize() {
    this.height = window.innerHeight
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.drag && this.drag.nativeElement) {
      this.drag.nativeElement.onmousedown = (event) => {
        event.stopPropagation()
        const start = event.clientX
        const currentWidth = this.width
        document.onmousemove = (docEvent) => {
          removeWindowSelection()
          const diff = docEvent.clientX - start
          const targetWidth = currentWidth + diff
          if (targetWidth > this.maxWidth) {
            this.width = this.maxWidth
            document.onmousemove = null
          } else if (targetWidth < this.minWidth) {
            this.width = this.minWidth
            document.onmousemove = null
          } else {
            this.width = targetWidth
          }
        }
      }
      this.drag.nativeElement.onmouseup = () => {
        document.onmousemove = null
        removeWindowSelection()
      }
    }
  }

}
