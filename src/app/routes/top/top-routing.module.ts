import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { TopTopComponent } from './top-top/top-top.component'

const routes: Routes = [
  { path: '', component: TopTopComponent, data: { titleI18n: 'title-top-top' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopRoutingModule { }
