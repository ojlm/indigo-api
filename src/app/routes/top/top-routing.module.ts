import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { TopContentComponent } from './top-content/top-content.component'
import { TopHomeComponent } from './top-home/top-home.component'
import { TopTopComponent } from './top-top/top-top.component'

const routes: Routes = [
  {
    path: '',
    component: TopTopComponent,
    children: [
      { path: '', component: TopHomeComponent, data: { titleI18n: 'title-top-top' } },
      { path: ':topGroup/:topProject:/:topId', component: TopContentComponent, data: { titleI18n: 'title-top-top' } },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopRoutingModule { }
