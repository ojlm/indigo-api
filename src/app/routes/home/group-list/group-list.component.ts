import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { GroupService } from '../../../api/service/group.service'
import { Group } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
})
export class GroupListComponent extends PageSingleModel implements OnInit {

  loading = false
  items: Group[] = []

  constructor(
    private groupService: GroupService,
    private router: Router,
  ) {
    super()
  }

  goItem(item: Group) {
    this.router.navigateByUrl(`/${item.id}`)
  }

  goSettings(item: Group) {
    this.router.navigateByUrl(`/group/${item.id}/settings`)
  }

  avatarText(item: Group) {
    return this.groupService.getAvatarText(item)
  }

  loadData() {
    this.loading = true
    this.groupService.query(this.toPageQuery()).subscribe(res => {
      this.items = res.data.list
      this.pageTotal = res.data.total
      this.loading = false
    }, _ => this.loading = false)
  }

  pageChange() {
    this.loadData()
  }

  ngOnInit() {
    this.loadData()
  }
}
