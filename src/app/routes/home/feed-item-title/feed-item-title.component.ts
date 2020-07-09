import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { FeedItem } from 'app/api/service/activity.service'
import { Activity, Group, Project } from 'app/model/es.model'
import { UserProfile } from 'app/model/user.model'

@Component({
  selector: 'app-feed-item-title',
  templateUrl: './feed-item-title.component.html',
  styles: [`
    :host {
      width: 100%;
    }
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

  group: Group
  project: Project
  user: UserProfile = {}
  activity: Activity = {}
  @Input() action = ''
  @Input()
  set item(val: FeedItem) {
    if (val.activity) this.activity = val.activity
    if (val.user) this.user = val.user
    if (val.group) this.group = val.group
    if (val.project) this.project = val.project
  }

  constructor(
    private router: Router
  ) { }

  title() {
    const group = this.group ? this.group.summary : this.activity.group
    const project = this.activity.project ? '/' + (this.project ? this.project.summary : this.activity.project) : ''
    return `${group}${project}`
  }

  go() {
    if (this.activity.project) {
      this.router.navigateByUrl(`/${this.activity.group}/${this.activity.project}`)
    } else {
      this.router.navigateByUrl(`/${this.activity.group}`)
    }
  }
}
