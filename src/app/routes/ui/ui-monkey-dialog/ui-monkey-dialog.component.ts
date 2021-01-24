import { Component, Input, OnInit } from '@angular/core'
import { FileNodeService, NewFile } from 'app/api/service/file.node.service'
import { MonkeyCommandParams } from 'app/api/service/ui.service'
import { PageSingleModel } from 'app/model/page.model'
import { NzModalRef } from 'ng-zorro-antd'

import { APP, FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-monkey-dialog',
  templateUrl: './ui-monkey-dialog.component.html',
  styleUrls: ['./ui-monkey-dialog.component.css']
})
export class UiMonkeyDialogComponent extends PageSingleModel implements OnInit {

  @Input() group = ''
  @Input() project = ''

  params: MonkeyCommandParams
  name = ''
  description = ''

  @Input() current: FileNode

  constructor(
    private modalRef: NzModalRef,
    private fileNodeService: FileNodeService,
  ) {
    super()
  }

  cancel() {
    this.modalRef.destroy(null)
  }

  submit() {
    const q: NewFile = {
      name: this.name,
      description: this.description,
      parent: this.current ? this.current._id : undefined,
      path: this.fileNodeService.toChildPath(this.current),
      app: APP.WEB_MONKEY,
      data: this.params
    }
    this.fileNodeService.newFile(this.group, this.project, q).subscribe(res => {
      this.modalRef.destroy(res.data)
    })
  }

  ngOnInit(): void {
  }

}
