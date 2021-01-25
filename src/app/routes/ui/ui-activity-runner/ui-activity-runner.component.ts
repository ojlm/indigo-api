import { Component, Input, OnDestroy, OnInit } from '@angular/core'

import { FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-activity-runner',
  templateUrl: './ui-activity-runner.component.html',
  styleUrls: ['./ui-activity-runner.component.css']
})
export class UiActivityRunnerComponent implements OnInit, OnDestroy {

  @Input() file: FileNode = {}

  constructor(
  ) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}
