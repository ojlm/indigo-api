import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { SharedService } from '../../../api/service/shared.service'
import { Group } from '../../../model/es.model'

@Component({
  selector: 'app-group-settings',
  templateUrl: './group-settings.component.html',
})
export class GroupSettingsComponent implements OnInit {

  form: FormGroup
  submitting = false

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private sharedService: SharedService,
  ) {
    this.form = this.fb.group({
      id: [null, []],
      summary: [null, []],
      description: [null, []],
      avatar: [null, []],
    })
    route.paramMap.subscribe(param => {
      const group = param.get('group')
      groupService.getById(group).subscribe(res => {
        const g = res.data
        sharedService.currentGroup.next(g)
        this.form = this.fb.group({
          id: [g.id, []],
          summary: [g.summary, []],
          description: [g.description, []],
          avatar: [g.avatar, []],
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
    const group = this.form.value as Group
    this.submitting = true
    this.groupService.update(group).subscribe(res => {
      this.submitting = false
      this.sharedService.currentGroup.next(group)
      this.msgService.success(res.msg)
    }, errRes => {
      this.submitting = false
    })
  }

  ngOnInit(): void {
  }
}
