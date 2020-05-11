import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { ActivityType, FeedItem } from 'app/api/service/activity.service'
import { dubboRequestSignature } from 'app/api/service/dubbo.service'
import { DubboRequest } from 'app/model/es.model'

@Component({
  selector: 'app-feed-dubbo',
  templateUrl: './feed-dubbo.component.html',
  styleUrls: ['../feed-item.css']
})
export class FeedDubboComponent {

  action = ''
  item: FeedItem = {}
  request: DubboRequest = {}
  signature = ''
  @Input()
  set data(item: FeedItem) {
    this.item = item
    this.request = item.data as DubboRequest || {}
    switch (item.activity.type) {
      case ActivityType.TYPE_NEW_DUBBO:
        this.action = 'create dubbo request'
        break
      case ActivityType.TYPE_TEST_DUBBO:
        this.action = 'send dubbo request'
        break
      default:
        break
    }
    this.signature = dubboRequestSignature(this.request)
  }

  constructor(
    private router: Router,
  ) { }

  go() {
    const activity = this.item.activity
    this.router.navigateByUrl(`/dubbo/${activity.group}/${activity.project}/${activity.targetId}`)
  }
}
