import { Component, Input, OnInit } from '@angular/core'
import { FileNodeService } from 'app/api/service/file.node.service'

import { FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-file-app-karate',
  templateUrl: './ui-file-app-karate.component.html',
  styleUrls: ['./ui-file-app-karate.component.css']
})
export class UiFileAppKarateComponent implements OnInit {

  @Input() file: FileNode = {}

  constructor(
    private fileNodeService: FileNodeService,
  ) { }

  ngOnInit(): void {
  }

}
