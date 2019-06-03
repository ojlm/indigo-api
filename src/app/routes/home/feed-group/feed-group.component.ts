import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { ActivityType, FeedItem } from 'app/api/service/activity.service'
import { Group } from 'app/model/es.model'

@Component({
  selector: 'app-feed-group',
  templateUrl: './feed-group.component.html',
  styleUrls: ['../feed-item.css']
})
export class FeedGroupComponent {

  action = ''
  item: FeedItem = {}
  group: Group = {}
  @Input()
  set data(item: FeedItem) {
    this.item = item
    this.group = item.data as Group || {}
    switch (item.activity.type) {
      case ActivityType.TYPE_NEW_PROJECT:
        this.action = 'create group'
        break;
      default:
        break;
    }
  }

  constructor(
    private router: Router,
  ) { }

  go() {
    const activity = this.item.activity
    this.router.navigateByUrl(`/${activity.group}`)
  }
}
