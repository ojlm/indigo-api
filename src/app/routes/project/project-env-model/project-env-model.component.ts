import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'

@Component({
  selector: 'app-project-env-model',
  templateUrl: './project-env-model.component.html',
})
export class ProjectEnvModelComponent implements OnInit {

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
