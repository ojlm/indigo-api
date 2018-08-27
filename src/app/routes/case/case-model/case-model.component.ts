import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { Case } from '../../../model/es.model'

@Component({
  selector: 'app-case-model',
  templateUrl: './case-model.component.html',
})
export class CaseModelComponent implements OnInit {

  cs: Case = {}

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
