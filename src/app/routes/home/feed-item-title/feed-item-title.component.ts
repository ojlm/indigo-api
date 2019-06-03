import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Activity } from 'app/model/es.model'
import { UserProfile } from 'app/model/user.model'

@Component({
  selector: 'app-feed-item-title',
  templateUrl: './feed-item-title.component.html',
  styles: [`
    .p {
      color: #24292e;
      font-weight: 600;
      font-size: 12px;
    }
    .p:hover {
      cursor: pointer;
      color: #0366d6;
    }
    .a {
      font-weight: 500;
      font-size: 12px;
      margin: 0 4px;
    }
    .t .s {
      float: right;
      visibility: hidden;
      font-size: smaller;
      font-weight: 500;
    }
    .t:hover .s {
      visibility: visible;
    }
  `]
})
export class FeedItemTitleComponent {

  _user: UserProfile = {}
  @Input()
  set user(val: UserProfile) {
    if (val) this._user = val
  }
  _activity: Activity = {}
  @Input()
  set activity(val: Activity) {
    if (val) this._activity = val
  }
  @Input() action = ''

  constructor(
    private router: Router
  ) { }

  go() {
    if (this._activity.project) {
      this.router.navigateByUrl(`/${this._activity.group}/${this._activity.project}`)
    } else {
      this.router.navigateByUrl(`/${this._activity.group}`)
    }
  }
}
