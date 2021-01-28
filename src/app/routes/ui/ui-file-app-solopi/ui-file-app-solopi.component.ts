import { Component, Input, OnInit } from '@angular/core'
import { BlobService } from 'app/api/service/blob.service'
import { FileNodeService } from 'app/api/service/file.node.service'

import { FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-file-app-solopi',
  templateUrl: './ui-file-app-solopi.component.html',
  styleUrls: ['./ui-file-app-solopi.component.css']
})
export class UiFileAppSolopiComponent implements OnInit {

  _file: FileNode = {}
  @Input()
  set file(val: FileNode) {
    if (val && val._id) {
      this._file = val
      // if (val.data && val.data.blob && val.data.blob.key) {
      //   this.blobService.readAsString(val.group, val.project, val.data.blob.key).subscribe(res => {
      //   })
      // }
    }
  }

  constructor(
    private blobService: BlobService,
    private fileNodeService: FileNodeService,
  ) { }

  ngOnInit(): void {
  }

}
