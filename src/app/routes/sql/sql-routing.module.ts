import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { SqlPlaygroundComponent } from './sql-playground/sql-playground.component'

const routes: Routes = [
  { path: '', component: SqlPlaygroundComponent, data: { titleI18n: 'title-sql' } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SqlRoutingModule { }
