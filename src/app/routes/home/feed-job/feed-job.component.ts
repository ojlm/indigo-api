import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { I18NService } from '@core'
import { ActivityType, FeedItem } from 'app/api/service/activity.service'
import { Job } from 'app/model/es.model'

@Component({
  selector: 'app-feed-job',
  templateUrl: './feed-job.component.html',
  styleUrls: ['../feed-item.css']
})
export class FeedJobComponent {

  action = ''
  item: FeedItem = {}
  job: Job = {}
  @Input()
  set data(item: FeedItem) {
    this.item = item
    this.job = item.data as Job || {}
    switch (item.activity.type) {
      case ActivityType.TYPE_NEW_JOB:
        this.action = this.i18nService.fanyi('tips-create-job')
        break
      case ActivityType.TYPE_TEST_JOB:
        this.action = this.i18nService.fanyi('tips-test-job')
        break
      default:
        break
    }
  }

  constructor(
    private i18nService: I18NService,
    private router: Router,
  ) { }

  go() {
    const activity = this.item.activity
    this.router.navigateByUrl(`/job/${activity.group}/${activity.project}/${activity.targetId}`)
  }
}
