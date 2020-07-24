import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { CaseModelComponent } from './case-model/case-model.component'
import { SwaggerImportComponent } from './swagger-import/swagger-import.component'

const routes: Routes = [
  { path: '', component: CaseModelComponent, data: { titleI18n: 'field-case' } },
  { path: 'new', component: CaseModelComponent, data: { titleI18n: 'field-case' } },
  { path: 'swagger', component: SwaggerImportComponent, data: { titleI18n: 'menu-swagger' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseRoutingModule { }
