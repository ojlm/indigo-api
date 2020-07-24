import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'

import { GroupService, QueryGroup } from '../../../api/service/group.service'
import { ProjectService } from '../../../api/service/project.service'
import { ApiRes } from '../../../model/api.model'
import { Group } from '../../../model/es.model'

@Component({
  selector: 'app-project-model',
  templateUrl: './project-model.component.html',
})
export class ProjectModelComponent implements OnInit {

  form: FormGroup
  submitting = false
  groups: Group[] = []
  isLoading = false
  groupQuerySubject: Subject<QueryGroup>

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  getSelectGroup(id: string) {
    const idx = this.groups.findIndex(g => g.id === id)
    if (idx > -1) {
      return this.groups[idx]
    } else {
      return null
    }
  }

  groupAvatarText(item: Group) {
    return this.groupService.getAvatarText(item)
  }

  getBreadcrumb(item: Group) {
    return this.groupService.getBreadcrumb(item)
  }

  searchGroup(id: string) {
    this.isLoading = true
    this.groupQuerySubject.next({ id: id })
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(param => {
      const groupId = param.get('group')
      this.form = this.fb.group({
        id: [null, [Validators.pattern('^([a-z]|[A-Z]|[0-9]|-|_|\\.)+$')]],
        group: [groupId, [Validators.pattern('^([a-z]|[A-Z]|[0-9]|-|_|\\.)+$')]],
        summary: [null, []],
        description: [null, []],
        avatar: [null, []],
        domains: [null, []]
      })
      const responseSubject = new Subject<ApiRes<Group[]>>()
      this.groupQuerySubject = this.groupService.newQuerySubject(responseSubject)
      responseSubject.subscribe(res => {
        this.isLoading = false
        this.groups = res.data.list
      }, err => this.isLoading = false)
      if (groupId) {
        this.groupService.getById(groupId).subscribe(res => this.groups = [res.data])
      }
    })
  }

  submit() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty()
      this.form.controls[i].updateValueAndValidity()
    }
    if (this.form.invalid) return
    const project = this.form.value
    if (project.domains && typeof project.domains === 'string') {
      project.domains = [{ name: project.domains }]
    }
    this.submitting = true
    this.projectService.index(project).subscribe(res => {
      this.submitting = false
      this.router.navigateByUrl(`/${project.group}/${project.id}`)
    }, err => this.submitting = false)
  }

  goBack() {
    this.location.back()
  }
}
