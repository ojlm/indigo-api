import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { Project } from '../../../model/es.model'

@Component({
  selector: 'app-project-api-new',
  templateUrl: './project-api-new.component.html',
})
export class ProjectApiNewComponent implements OnInit {

  project: Project = {}
  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private msgService: NzMessageService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }
}
