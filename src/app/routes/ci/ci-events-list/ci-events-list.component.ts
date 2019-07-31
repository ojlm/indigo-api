import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { TriggerService } from 'app/api/service/trigger.service'
import { TriggerEventLog, TriggerEventLogType } from 'app/model/es.model'

import { PageSingleModel } from '../../../model/page.model'

@Component({
  selector: 'app-ci-events-list',
  templateUrl: './ci-events-list.component.html',
  styleUrls: ['./ci-events-list.component.css']
})
export class CiEventsListListComponent extends PageSingleModel implements OnInit {

  items: TriggerEventLog[] = []
  loading = false
  group: string
  project: string

  constructor(
    private triggerService: TriggerService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super()
  }

  editTrigger(item: TriggerEventLog) {
    this.router.navigateByUrl(`/ci/${item.group}/${item.project}/${item.triggerId}`)
  }

  viewReport(item: TriggerEventLog) {
    this.router.navigateByUrl(`/report/job/${item.targetGroup}/${item.targetProject}/${item.reportId}`)
  }

  resultColor(item: TriggerEventLog) {
    let color = 'lightgray'
    switch (item.result) {
      case TriggerEventLogType.success:
        color = 'green'
        break;
      case TriggerEventLogType.fail:
        color = 'red'
        break;
      case TriggerEventLogType.debounce:
        color = 'lightblue'
      default:
        break;
    }
    return color
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
