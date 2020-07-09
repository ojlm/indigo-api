import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { I18NService } from '@core'
import { ActivityType, FeedItem } from 'app/api/service/activity.service'
import { httpRequestSignature } from 'app/api/service/case.service'
import { Case } from 'app/model/es.model'

@Component({
  selector: 'app-feed-http',
  templateUrl: './feed-http.component.html',
  styleUrls: ['../feed-item.css']
})
export class FeedHttpComponent {

  action = ''
  item: FeedItem = {}
  request: Case = { request: {} }
  signature = ''
  @Input()
  set data(item: FeedItem) {
    this.item = item
    this.request = item.data as Case || {}
    switch (item.activity.type) {
      case ActivityType.TYPE_NEW_CASE:
        this.action = this.i18nService.fanyi('tips-create-http')
        break
      case ActivityType.TYPE_TEST_CASE:
        this.action = this.i18nService.fanyi('tips-test-http')
        break
      default:
        break
    }
    this.signature = httpRequestSignature(this.request)
  }

  constructor(
    private i18nService: I18NService,
    private router: Router,
  ) { }

  go() {
    const activity = this.item.activity
    this.router.navigateByUrl(`/case/${activity.group}/${activity.project}/${activity.targetId}`)
  }

  methodTagColor() {
    if (this.request && this.request.request) {
      switch (this.request.request.method) {
        case 'GET':
          return 'green'
        case 'DELETE':
          return 'red'
        case 'POST':
          return 'cyan'
        case 'PUT':
          return 'blue'
        default:
          return 'purple'
      }
    } else {
      return ''
    }
  }
}
