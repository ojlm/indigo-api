import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FileNodeService, NewFolder } from 'app/api/service/file.node.service'
import { PageSingleModel } from 'app/model/page.model'
import { NzModalRef } from 'ng-zorro-antd'

import { FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-folder-dialog',
  templateUrl: './ui-folder-dialog.component.html',
  styleUrls: ['./ui-folder-dialog.component.css']
})
export class UiFolderDialogComponent extends PageSingleModel implements OnInit {

  @Input() group = ''
  @Input() project = ''

  form: FormGroup
  @Input() current: FileNode

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private fileNodeService: FileNodeService,
  ) {
    super()
  }

  cancel() {
    this.modalRef.destroy(null)
  }

  submit() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty()
      this.form.controls[i].updateValueAndValidity()
    }
    if (this.form.invalid) return
    const q: NewFolder = {
      ...this.form.value,
      parent: this.current ? this.current._id : undefined,
      path: this.fileNodeService.toChildPath(this.current)
    }
    this.fileNodeService.newFolder(this.group, this.project, q).subscribe(res => {
      this.modalRef.destroy(res.data)
    })
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, []],
    })
  }

}
