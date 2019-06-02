import { Component, Input } from '@angular/core'
import { FeedItem } from 'app/api/service/activity.service'

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
})
export class FeedListComponent {

  items: FeedItem[] = []
  @Input()
  set data(items: FeedItem[]) {
    this.items = items
  }

  constructor() { }
}
