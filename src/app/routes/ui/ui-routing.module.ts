import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { NovncComponent } from './novnc/novnc.component'

const routes: Routes = [
  { path: '', component: NovncComponent, data: { titleI18n: 'title-ui' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UiRoutingModule { }
