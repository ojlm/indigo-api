import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core'

import { FileNode, removeWindowSelection } from '../ui.model'

@Component({
  selector: 'app-ui-activity-bar',
  templateUrl: './ui-activity-bar.component.html',
  styleUrls: ['./ui-activity-bar.component.css']
})
export class UiActivityBarComponent implements OnInit, AfterViewInit {

  @ViewChild('drag') drag: ElementRef
  minWidth = 360
  maxWidth = window.innerWidth / 2
  width = 60
  lastWidth = 480

  height = window.innerHeight
  @Input() file: FileNode = {}
  tabBarStyle = {
    backgroundColor: 'ghostwhite',
    width: '60px',
  }

  @HostListener('window:resize')
  resize() {
    this.height = window.innerHeight
    this.maxWidth = window.innerWidth / 2
  }

  tabIndex = 0
  hideAll = true

  tabClick(idx: number) {
    if (idx === this.tabIndex) {
      this.hideAll = !this.hideAll
      if (this.hideAll) {
        this.lastWidth = this.width
        this.width = 60
      } else {
        this.width = this.lastWidth
      }
    } else {
      if (this.hideAll) {
        this.width = this.lastWidth
        this.hideAll = !this.hideAll
      }
    }
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
          const diff = start - docEvent.clientX
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
