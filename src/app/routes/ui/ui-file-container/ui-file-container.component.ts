import { Component, HostListener, OnInit } from '@angular/core'

@Component({
  selector: 'app-ui-file-container',
  templateUrl: './ui-file-container.component.html',
  styleUrls: ['./ui-file-container.component.css']
})
export class UiFileContainerComponent implements OnInit {

  height = window.innerHeight

  @HostListener('window:resize')
  resize() {
    this.height = window.innerHeight
  }

  constructor() { }

  ngOnInit(): void {
  }

}
