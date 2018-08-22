import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { GroupService, QueryGroup } from '../../../api/service/group.service'
import { ProjectService } from '../../../api/service/project.service'
import { Group } from '../../../model/es.model'

@Component({
  selector: 'app-project-apis',
  templateUrl: './project-apis.component.html',
})
export class ProjectApisComponent implements OnInit {

  avatar = ''
  form: FormGroup
  submitting = false
  groups: Group[] = []
  isLoading = false
  groupQuerySubject: Subject<QueryGroup>

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private projectService: ProjectService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  searchGroup(id: string) {
    this.isLoading = true
    this.groupQuerySubject.next({ id: id })
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      const group = params['group']
      const project = params['project']
      if (group && project) {
        console.log('apis:', group, project)
      }
    })
  }
}
