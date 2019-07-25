import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { CiEventComponent } from './ci-event/ci-event.component'
import { CiEventsListListComponent } from './ci-events-list/ci-events-list.component'

const routes: Routes = [
  { path: '', component: CiEventComponent, data: { titleI18n: 'title-cicd' } },
  { path: 'new', component: CiEventComponent, data: { titleI18n: 'title-cicd' } },
  { path: 'events', component: CiEventsListListComponent, data: { titleI18n: 'title-cicd' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CiRoutingModule { }
