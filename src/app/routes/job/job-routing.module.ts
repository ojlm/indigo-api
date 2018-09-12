import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { JobModelComponent } from './job-model/job-model.component'

const routes: Routes = [
  { path: '', component: JobModelComponent, data: { titleI18n: 'field-job' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobRoutingModule { }
