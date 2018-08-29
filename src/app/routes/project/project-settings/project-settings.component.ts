import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { ProjectService } from '../../../api/service/project.service'
import { SharedService } from '../../../api/service/shared.service'
import { Project } from '../../../model/es.model'

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
})
export class ProjectSettingsComponent implements OnInit {

  form: FormGroup
  submitting = false

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private sharedService: SharedService,
  ) {
    this.form = this.fb.group({
      id: [null, []],
      group: [null, []],
      summary: [null, []],
      description: [null, []],
      avatar: [null, []],
    })
    route.paramMap.subscribe(param => {
      const group = param.get('group')
      const project = param.get('project')
      projectService.getById(group, project).subscribe(res => {
        const p = res.data
        sharedService.currentProject.next(p)
        this.form = this.fb.group({
          id: [p.id, []],
          group: [p.group, []],
          summary: [p.summary, []],
          description: [p.description, []],
          avatar: [p.avatar, []],
        })
      })
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
    this.projectService.update(project).subscribe(res => {
      this.submitting = false
      this.sharedService.currentProject.next(project)
      this.msgService.success(res.msg)
    }, errRes => {
      this.submitting = false
    })
  }

  ngOnInit(): void {
  }
}
