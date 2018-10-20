import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { DelonABCModule } from '@delon/abc'
import { DelonACLModule } from '@delon/acl'
import { DelonFormModule } from '@delon/form'
import { AlainThemeModule } from '@delon/theme'
import { TranslateModule } from '@ngx-translate/core'
import { AuthSelectorComponent } from '@shared/auth-selector/auth-selector.component'
import { ConsoleReportComponent } from '@shared/console-report/console-report.component'
import { EnvModelComponent } from '@shared/env-model/env-model.component'
import { EnvSelectorComponent } from '@shared/env-selector/env-selector.component'
import { KeyValueComponent } from '@shared/key-value/key-value.component'
import { ProjectBreadcrumbComponent } from '@shared/project-breadcrumb/project-breadcrumb.component'
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { CountdownModule } from 'ngx-countdown'
import { MarkdownModule } from 'ngx-markdown'
import { MonacoEditorModule } from 'ngx-monaco-editor'

import { CaseSearchPanelComponent } from './case-search-panel/case-search-panel.component'
import { LabelListComponent } from './label-list/label-list.component'
import { LinkerdHttpComponent } from './linkerd-http/linkerd-http.component'
import { PofileSimpleComponent } from './profile-simple/profile-simple.component'
import { RestModelComponent } from './rest-model/rest-model.component'

// delon
// i18n
// region: third libs
const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule,
  TranslateModule,
]
// endregion

// region: your componets & directives
const COMPONENTS = [
  ProjectBreadcrumbComponent,
  KeyValueComponent,
  ConsoleReportComponent,
  EnvModelComponent,
  EnvSelectorComponent,
  AuthSelectorComponent,
  LinkerdHttpComponent,
  LabelListComponent,
  PofileSimpleComponent,
  RestModelComponent,
  CaseSearchPanelComponent,
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
    MarkdownModule.forChild(),
    MonacoEditorModule,
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
