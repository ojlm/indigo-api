import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { ScenarioModelComponent } from './scenario-model/scenario-model.component'

const routes: Routes = [
  { path: '', component: ScenarioModelComponent, data: { titleI18n: 'field-scenario' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScenarioRoutingModule { }
