import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { GroupService, QueryGroup } from 'app/api/service/group.service'
import { ProjectService, QueryProject } from 'app/api/service/project.service'
import { ApiRes } from 'app/model/api.model'
import { Group, Project } from 'app/model/es.model'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-group-project-selector',
  templateUrl: './group-project-selector.component.html',
})
export class GroupProjectSelectorComponent implements OnInit {

  isLoading = false
  groups: Group[] = []
  projects: Project[] = []
  groupQuerySubject: Subject<QueryGroup>
  projectQuerySubject: Subject<QueryProject>
  group: Group = {}
  project: Project = {}
  model: GroupProjectSelectorModel = {}
  @Input()
  set data(val: GroupProjectSelectorModel) {
    this.model = val
    if (this.model.group) {
      this.group = { id: this.model.group }
      this.groups.push(this.group)
      if (this.model.project) {
        this.project = { group: this.model.group, id: this.model.project }
        this.projects.push(this.project)
      }
    }
  }
  get data() {
    return this.model
  }
  @Output()
  dataChange = new EventEmitter<GroupProjectSelectorModel>()
  @Input() projectEditable = false

  constructor(
    private groupService: GroupService,
    private projectService: ProjectService,
  ) {
    const responseGroupSubject = new Subject<ApiRes<Group[]>>()
    this.groupQuerySubject = this.groupService.newQuerySubject(responseGroupSubject)
    responseGroupSubject.subscribe(res => {
      this.isLoading = false
      this.groups = res.data.list
    }, err => this.isLoading = false)
    const responseProjectSubject = new Subject<ApiRes<Project[]>>()
    this.projectQuerySubject = this.projectService.newQuerySubject(responseProjectSubject)
    responseProjectSubject.subscribe(res => {
      this.isLoading = false
      this.projects = res.data.list
    }, err => this.isLoading = false)
  }

  projectChange() {
    if (this.project && this.groups.length === 0 && this.project) {
      this.group = { id: this.project.group }
      this.groups.push(this.group)
    }
    this.modelChange()
  }

  modelChange() {
    if (this.group) {
      this.model.group = this.group.id
    } else {
      this.model.group = undefined
    }
    if (this.project) {
      this.model.project = this.project.id
    } else {
      this.model.project = undefined
    }
    this.dataChange.emit(this.model)
  }

  openSearchGroup() {
    if (this.groups.length === 0) {
      this.searchGroup(undefined)
    }
  }

  searchGroup(id: string) {
    this.isLoading = true
    this.groupQuerySubject.next({ id: id })
  }

  openSearchProject() {
    if (this.projects.length === 0) {
      this.searchProject(undefined)
    }
  }

  searchProject(id: string) {
    this.isLoading = true
    this.projectQuerySubject.next({ group: this.group.id, id: id })
  }

  ngOnInit(): void {
  }
}

export interface GroupProjectSelectorModel {
  group?: string
  project?: string
}
