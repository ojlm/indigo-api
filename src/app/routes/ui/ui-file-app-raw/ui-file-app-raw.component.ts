import { Component, Input, OnInit } from '@angular/core'
import { FileNodeService } from 'app/api/service/file.node.service'

import { FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-file-app-raw',
  templateUrl: './ui-file-app-raw.component.html',
  styleUrls: ['./ui-file-app-raw.component.css']
})
export class UiFileAppRawComponent implements OnInit {

  @Input() file: FileNode = {}

  constructor(
    private fileNodeService: FileNodeService,
  ) { }

  ngOnInit(): void {
  }

}
