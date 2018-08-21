import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { Project } from '../../../model/es.model'

@Component({
  selector: 'app-project-model',
  templateUrl: './project-model.component.html',
})
export class ProjectModelComponent implements OnInit {

  avatar = ''
  form: FormGroup
  submitting = false
  project: Project = {}
  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private msgService: NzMessageService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null, [Validators.pattern('^([a-z]|[A-Z]|[0-9]|-|_|\\.)+$')]],
      summary: [null, []],
      description: [null, []],
      avatar: [null, []],
    })
  }

  submit() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty()
      this.form.controls[i].updateValueAndValidity()
    }
    if (this.form.invalid) return
    const project = this.form.value as Project
    this.submitting = true
    console.log(project)
  }

  goBack() {
    this.location.back()
  }
}
