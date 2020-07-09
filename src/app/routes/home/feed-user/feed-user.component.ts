import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { I18NService } from '@core'
import { ActivityType, FeedItem } from 'app/api/service/activity.service'
import { UserProfile } from 'app/model/user.model'

@Component({
  selector: 'app-feed-user',
  templateUrl: './feed-user.component.html',
  styleUrls: ['../feed-item.css']
})
export class FeedUserComponent {

  action = ''
  item: FeedItem = {}
  profile: UserProfile = {}
  @Input()
  set data(item: FeedItem) {
    this.item = item
    this.profile = item.user as UserProfile || {}
    switch (item.activity.type) {
      case ActivityType.TYPE_NEW_USER:
        this.action = this.i18nService.fanyi('tips-user-join')
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
  }
}
