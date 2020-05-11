import { ExceptionModule } from '@delon/abc/exception'
import { GlobalFooterModule } from '@delon/abc/global-footer'
import { NoticeIconModule } from '@delon/abc/notice-icon'
import { PageHeaderModule } from '@delon/abc/page-header'
import { ResultModule } from '@delon/abc/result'
import { SidebarNavModule } from '@delon/abc/sidebar-nav'

export const SHARED_DELON_MODULES = [
  PageHeaderModule,
  ResultModule,
  ExceptionModule,
  NoticeIconModule,
  SidebarNavModule,
  GlobalFooterModule,
]
