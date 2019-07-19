import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { CiEventComponent } from './ci-event/ci-event.component'

const routes: Routes = [
  { path: '', component: CiEventComponent, data: { titleI18n: 'title-cicd' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CiRoutingModule { }
