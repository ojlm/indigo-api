import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { DelonABCModule } from '@delon/abc'
import { DelonACLModule } from '@delon/acl'
import { DelonFormModule } from '@delon/form'
import { AlainThemeModule } from '@delon/theme'
import { TranslateModule } from '@ngx-translate/core'
import { ProjectBreadcrumbComponent } from '@shared/project-breadcrumb/project-breadcrumb.component'
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { CountdownModule } from 'ngx-countdown'

// delon
// i18n
// region: third libs
const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule
]
// endregion

// region: your componets & directives
const COMPONENTS = [
  ProjectBreadcrumbComponent,
]
const DIRECTIVES = []
// endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ]
})
export class SharedModule { }
