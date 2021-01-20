import { Component, Input, OnInit } from '@angular/core'

import { FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-activity-bar',
  templateUrl: './ui-activity-bar.component.html',
  styleUrls: ['./ui-activity-bar.component.css']
})
export class UiActivityBarComponent implements OnInit {

  @Input() file: FileNode = {}
  tabBarStyle = {}

  constructor() { }

  ngOnInit(): void {
  }

}
