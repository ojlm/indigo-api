import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { DubboPlaygroundComponent } from './dubbo-playground/dubbo-playground.component'

const routes: Routes = [
  { path: '', component: DubboPlaygroundComponent, data: { titleI18n: 'title-playground' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DubboRoutingModule { }
