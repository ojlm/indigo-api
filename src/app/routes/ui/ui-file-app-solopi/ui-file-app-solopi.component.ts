import { Component, Input, OnInit } from '@angular/core'
import { FileNodeService } from 'app/api/service/file.node.service'

import { FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-file-app-solopi',
  templateUrl: './ui-file-app-solopi.component.html',
  styleUrls: ['./ui-file-app-solopi.component.css']
})
export class UiFileAppSolopiComponent implements OnInit {

  @Input() file: FileNode = {}

  constructor(
    private fileNodeService: FileNodeService,
  ) { }

  ngOnInit(): void {
  }

}
