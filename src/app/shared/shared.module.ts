import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { DelonACLModule } from '@delon/acl'
import { AlainThemeModule } from '@delon/theme'
import { TranslateModule } from '@ngx-translate/core'
import { AuthSelectorComponent } from '@shared/auth-selector/auth-selector.component'
import { ConsoleReportComponent } from '@shared/console-report/console-report.component'
import { EnvModelComponent } from '@shared/env-model/env-model.component'
import { EnvSelectorComponent } from '@shared/env-selector/env-selector.component'
import { KeyValueComponent } from '@shared/key-value/key-value.component'
import { ProjectBreadcrumbComponent } from '@shared/project-breadcrumb/project-breadcrumb.component'
import { MarkdownModule } from 'ngx-markdown'
import { MonacoEditorModule } from 'ngx-monaco-editor'
import { SortablejsModule } from 'ngx-sortablejs'

import { AssertionAutoCompleteComponent } from './assertion-list/assertion-auto-complete/assertion-auto-complete.component'
import { AssertionAutoCompleteDirective } from './assertion-list/assertion-auto-complete/assertion-auto-complete.directive'
import { AssertionListComponent } from './assertion-list/assertion-list.component'
import { AssertionsComponent } from './assertions/assertions.component'
import { CaseSearchPanelComponent } from './case-search-panel/case-search-panel.component'
import { DeleteItemComponent } from './delete-item/delete-item.component'
import { DubboSearchPanelComponent } from './dubbo-search-panel/dubbo-search-panel.component'
import { GroupProjectSelectorComponent } from './group-project-selector/group-project-selector.component'
import { LabelListComponent } from './label-list/label-list.component'
import { LinkerdHttpComponent } from './linkerd-http/linkerd-http.component'
import { MonacoEditorComponent } from './monaco-editor/monaco-editor.component'
import { PlaygroundReportTabComponent } from './playground-report-tab/playground-report-tab.component'
import { PofileSimpleComponent } from './profile-simple/profile-simple.component'
import { RestModelComponent } from './rest-model/rest-model.component'
import { RuntimeToolboxComponent } from './runtime-toolbox/runtime-toolbox.component'
import { SHARED_DELON_MODULES } from './shared-delon.module'
import { SHARED_ZORRO_MODULES } from './shared-zorro.module'
import { SqlSearchPanelComponent } from './sql-search-panel/sql-search-panel.component'
import { StepsRuntimeComponent } from './steps-runtime/steps-runtime.component'
import { ExportAutoCompleteComponent } from './variables-export-table/export-auto-complete/export-auto-complete.component'
import { ExportAutoCompleteDirective } from './variables-export-table/export-auto-complete/export-auto-complete.directive'
import { VariablesExportTableComponent } from './variables-export-table/variables-export-table.component'
import { VariablesImportTableComponent } from './variables-import-table/variables-import-table.component'
import { VariablesOptionsComponent } from './variables-options/variables-options.component'

// delon
// i18n
// region: third libs
const THIRDMODULES = [
  TranslateModule,
  SortablejsModule,
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
  DeleteItemComponent,
  GroupProjectSelectorComponent,
  SqlSearchPanelComponent,
  DubboSearchPanelComponent,
  PlaygroundReportTabComponent,
  VariablesExportTableComponent,
  VariablesImportTableComponent,
  VariablesOptionsComponent,
  ExportAutoCompleteDirective,
  ExportAutoCompleteComponent,
  AssertionAutoCompleteDirective,
  AssertionAutoCompleteComponent,
  AssertionListComponent,
  AssertionsComponent,
  MonacoEditorComponent,
  StepsRuntimeComponent,
  RuntimeToolboxComponent,
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
    DelonACLModule.forRoot(),
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  entryComponents: [
    DeleteItemComponent,
    VariablesOptionsComponent,
    AssertionsComponent,
    MonacoEditorComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonACLModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
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
