import { Component, Input, OnInit } from '@angular/core'
import { FileNodeService } from 'app/api/service/file.node.service'
import { PageSingleModel } from 'app/model/page.model'
import { UploadChangeParam } from 'ng-zorro-antd/upload'

import { APP, FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-upload-dialog',
  templateUrl: './ui-upload-dialog.component.html',
  styleUrls: ['./ui-upload-dialog.component.css']
})
export class UiUploadDialogComponent extends PageSingleModel implements OnInit {

  UPLOAD_ACTION = ''
  ACCEPT = ''
  extraData: any = {}

  @Input() group = ''
  @Input() project = ''
  @Input() app = ''
  @Input() current: FileNode

  constructor(
    private fileNodeService: FileNodeService,
  ) {
    super()
  }

  handleChange({ file, fileList }: UploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      console.log('done:', file)
    } else if (status === 'error') {
      console.log('error:', file)
    }
  }

  ngOnInit(): void {
    this.UPLOAD_ACTION = this.fileNodeService.getUploadUrl(this.group, this.project)
    this.extraData.app = this.app
    switch (this.app) {
      case APP.SOLOPI:
        this.ACCEPT = '.json'
        break
      case APP.KARATE:
        this.ACCEPT = '.feature'
        break
      case APP.RAW:
        break
      default:
        break
    }
    if (this.current) {
      const path = { path: this.fileNodeService.toChildPath(this.current) }
      this.extraData.path = JSON.stringify(path)
      this.extraData.parent = this.current._id
    }
  }

}
