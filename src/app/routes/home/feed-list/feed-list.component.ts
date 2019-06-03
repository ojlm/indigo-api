import { Component, Input } from '@angular/core'
import { FeedItem } from 'app/api/service/activity.service'

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styles: [`
    .feed-item {
      width: 100%;
    }
  `]
})
export class FeedListComponent {

  loading = true
  items: FeedItem[] = []
  @Input()
  set data(items: FeedItem[]) {
    this.items = items
    if (this.items.length > 0) {
      this.loading = false
    }
  }

  constructor() { }
}
