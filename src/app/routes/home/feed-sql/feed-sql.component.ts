import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { I18NService } from '@core'
import { ActivityType, FeedItem } from 'app/api/service/activity.service'
import { sqlRequestSignature } from 'app/api/service/sql.service'
import { SqlRequest } from 'app/model/es.model'

@Component({
  selector: 'app-feed-sql',
  templateUrl: './feed-sql.component.html',
  styleUrls: ['../feed-item.css']
})
export class FeedSqlComponent {

  action = ''
  item: FeedItem = {}
  request: SqlRequest = {}
  signature = ''
  @Input()
  set data(item: FeedItem) {
    this.item = item
    this.request = item.data as SqlRequest || {}
    switch (item.activity.type) {
      case ActivityType.TYPE_NEW_SQL:
        this.action = this.i18nService.fanyi('tips-create-sql')
        break
      case ActivityType.TYPE_TEST_SQL:
        this.action = this.i18nService.fanyi('tips-test-sql')
        break
      default:
        break
    }
    this.signature = sqlRequestSignature(this.request)
  }

  constructor(
    private i18nService: I18NService,
    private router: Router,
  ) { }

  go() {
    const activity = this.item.activity
    this.router.navigateByUrl(`/sql/${activity.group}/${activity.project}/${activity.targetId}`)
  }
}
