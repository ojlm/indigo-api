import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { Group } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
})
export class GroupsComponent extends PageSingleModel implements OnInit {

  loading = false
  groups: Group[] = []
  constructor(
    private groupService: GroupService,
    private msg: NzMessageService,
    private router: Router,
  ) {
    super()
  }

  goGroup(item: Group) {
    this.router.navigateByUrl(`/group/${item.id}`)
  }

  goSettings(item: Group) {
    this.router.navigateByUrl(`/group/${item.id}/settings`)
  }

  ngOnInit() {
    this.loading = true
    this.groupService.query(this.toPageQuery()).subscribe(res => {
      this.groups = res.data.list
      this.pageTotal = res.data.total
      this.loading = false
    }, err => this.loading = false)
  }
}
