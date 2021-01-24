import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FileNodeService } from 'app/api/service/file.node.service'

import { FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-file',
  templateUrl: './ui-file.component.html',
  styleUrls: ['./ui-file.component.css']
})
export class UiFileComponent implements OnInit {

  group: string
  project: string
  id: string
  file: FileNode = {}

  constructor(
    private fileNodeService: FileNodeService,
    private route: ActivatedRoute,
  ) { }

  load() {
    this.fileNodeService.get(this.group, this.project, this.id).subscribe(res => {
      this.file = res.data
    })
  }

  ngOnInit(): void {
    const parentParams = this.route.parent.snapshot.params
    this.group = parentParams['group']
    this.project = parentParams['project']
    this.route.params.subscribe(params => {
      this.id = params['fileId']
      this.load()
    })
  }

}
