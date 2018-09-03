import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { CaseModelComponent } from './case-model/case-model.component'

const routes: Routes = [
  { path: 'new', component: CaseModelComponent, data: { titleI18n: 'field-case' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseRoutingModule { }
