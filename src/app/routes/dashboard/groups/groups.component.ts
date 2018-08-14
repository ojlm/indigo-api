import { Component, OnInit } from '@angular/core'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { Group } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
})
export class GroupsComponent extends PageSingleModel implements OnInit {

  groups: Group[] = []
  constructor(
    private groupService: GroupService,
    private msg: NzMessageService
  ) {
    super()
  }

  edit(item: Group): void {

  }

  ngOnInit() {
    this.groupService.query({ size: 20 }).subscribe(res => {
      this.groups = res.data.list
      this.pageTotal = res.data.total
    })
  }
}
