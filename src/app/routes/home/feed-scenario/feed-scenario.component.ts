import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { I18NService } from '@core'
import { ActivityType, FeedItem } from 'app/api/service/activity.service'
import { Scenario } from 'app/model/es.model'

@Component({
  selector: 'app-feed-scenario',
  templateUrl: './feed-scenario.component.html',
  styleUrls: ['../feed-item.css']
})
export class FeedScenarioComponent {

  action = ''
  item: FeedItem = {}
  scenario: Scenario = {}
  @Input()
  set data(item: FeedItem) {
    this.item = item
    this.scenario = item.data as Scenario || {}
    switch (item.activity.type) {
      case ActivityType.TYPE_NEW_SCENARIO:
        this.action = this.i18nService.fanyi('tips-create-scenario')
        break
      case ActivityType.TYPE_TEST_SCENARIO:
        this.action = this.i18nService.fanyi('tips-test-scenario')
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
    this.router.navigateByUrl(`/scenario/${activity.group}/${activity.project}/${activity.targetId}`)
  }
}
