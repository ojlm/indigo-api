import { NgModule } from '@angular/core'
import { SharedModule } from '@shared/shared.module'

import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component'
import { HeaderFullScreenComponent } from './indigo/header/components/fullscreen.component'
import { HeaderI18nComponent } from './indigo/header/components/i18n.component'
import { HeaderNewComponent } from './indigo/header/components/new.component'
import { HeaderSearchComponent } from './indigo/header/components/search.component'
import { HeaderStorageComponent } from './indigo/header/components/storage.component'
import { HeaderUserComponent } from './indigo/header/components/user.component'
import { HeaderComponent } from './indigo/header/header.component'
import { LayoutGroupComponent } from './indigo/layout-group/layout-group.component'
import { LayoutIndigoComponent } from './indigo/layout-indigo/layout-indigo.component'
import { LayoutProjectComponent } from './indigo/layout-project/layout-project.component'
import { LayoutPassportComponent } from './passport/passport.component'

const COMPONENTS = [
  HeaderComponent,
  LayoutIndigoComponent,
  LayoutFullScreenComponent,
  LayoutGroupComponent,
  LayoutProjectComponent,
]

const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderFullScreenComponent,
  HeaderI18nComponent,
  HeaderStorageComponent,
  HeaderUserComponent,
  HeaderNewComponent
]

// passport
const PASSPORT = [
  LayoutPassportComponent
]

@NgModule({
  imports: [SharedModule],
  providers: [],
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS,
    ...PASSPORT
  ],
  exports: [
    ...COMPONENTS,
    ...PASSPORT
  ]
})
export class LayoutModule { }
