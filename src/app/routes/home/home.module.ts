import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'

import { FeedDubboComponent } from './feed-dubbo/feed-dubbo.component'
import { FeedGroupComponent } from './feed-group/feed-group.component'
import { FeedHttpComponent } from './feed-http/feed-http.component'
import { FeedItemTitleComponent } from './feed-item-title/feed-item-title.component'
import { FeedJobComponent } from './feed-job/feed-job.component'
import { FeedListComponent } from './feed-list/feed-list.component'
import { FeedProjectComponent } from './feed-project/feed-project.component'
import { FeedScenarioComponent } from './feed-scenario/feed-scenario.component'
import { FeedSqlComponent } from './feed-sql/feed-sql.component'
import { FeedUserComponent } from './feed-user/feed-user.component'
import { GroupListComponent } from './group-list/group-list.component'
import { HomeComponent } from './home.component'
import { Home2Component } from './home2/home2.component'
import { MyProjectListComponent } from './my-project-list/my-project-list.component'

const COMPONENTS = [
  GroupListComponent,
  MyProjectListComponent,
  HomeComponent,
  Home2Component,
  FeedListComponent,
  FeedItemTitleComponent,
  FeedUserComponent,
  FeedGroupComponent,
  FeedProjectComponent,
  FeedJobComponent,
  FeedScenarioComponent,
  FeedHttpComponent,
  FeedDubboComponent,
  FeedSqlComponent,
]
const COMPONENTS_NOROUNT = []

@NgModule({
  imports: [SharedModule, NgxChartsModule, InfiniteScrollModule],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT,
  exports: [
    ...COMPONENTS,
  ],
})
export class HomeModule { }
