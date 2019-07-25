import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TriggerService } from 'app/api/service/trigger.service'
import { TriggerEventLog } from 'app/model/es.model'

import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-ci-events-list',
  templateUrl: './ci-events-list.component.html',
})
export class CiEventsListListComponent extends PageSingleModel implements OnInit {

  items: TriggerEventLog[] = []
  loading = false
  group: string
  project: string

  constructor(
    private triggerService: TriggerService,
    private route: ActivatedRoute,
  ) {
    super()
  }

  getSignature(item: TriggerEventLog) {
    return `[${item.group}/${item.project}][${item.env}][T: ${item.type}][Author: ${item.author}] S:${item.service}`
  }

  loadData() {
    if (this.group && this.project) {
      this.loading = true
      this.triggerService.events({ group: this.group, project: this.project, ...this.toPageQuery() }).subscribe(res => {
        this.loading = false
        this.items = res.data.list
        this.pageTotal = res.data.total
      }, err => this.loading = false)
    }
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.loadData()
    })
  }
}
