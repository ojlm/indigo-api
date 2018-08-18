import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { Group } from '../../../model/es.model'

@Component({
  selector: 'app-group-model',
  templateUrl: './group-model.component.html',
})
export class GroupModelComponent implements OnInit {

  avatar = ''
  form: FormGroup
  submitting = false
  group: Group = {}
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
    const group = this.form.value as Group
    this.submitting = true
    this.groupService.index(group).subscribe(res => {
      this.submitting = false
      this.router.navigateByUrl(`/group/${res.data.id}`)
    }, errRes => {
      this.submitting = false
    })
  }

  goBack() {
    this.location.back()
  }
}
