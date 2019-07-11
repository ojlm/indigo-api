import { DOCUMENT } from '@angular/common'
import {
  AfterViewInit,
  ComponentFactoryResolver,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'
import { NavigationCancel, NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router'
import { SettingsService } from '@delon/theme'
import { updateHostClass } from '@delon/util'
import { environment } from '@env/environment'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { AssistantDrawerComponent } from './assistant-drawer/assistant-drawer.component'
import { SettingDrawerComponent } from './setting-drawer/setting-drawer.component'

export class LayoutAbstractClass implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe$ = new Subject<void>()
  @ViewChild('settingHost', { read: ViewContainerRef })
  private settingHost: ViewContainerRef
  @ViewChild('assistant', { read: ViewContainerRef })
  private assistant: ViewContainerRef
  isFetching = false

  constructor(
    router: Router,
    _message: NzMessageService,
    private resolver: ComponentFactoryResolver,
    public settings: SettingsService,
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private doc: any,
  ) {
    // scroll to top in change page
    router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true
      }
      if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
        this.isFetching = false
        if (evt instanceof NavigationError) {
          _message.error(`Can not load route: ${evt.url}`, { nzDuration: 1000 * 3 })
        }
        return
      }
      if (!(evt instanceof NavigationEnd)) {
        return
      }
      setTimeout(() => {
        this.isFetching = false
      }, 100)
    })
  }

  private setClass() {
    const { el, doc, renderer, settings } = this
    const layout = settings.layout
    updateHostClass(
      el.nativeElement,
      renderer,
      {
        ['alain-default']: true,
        [`alain-default__fixed`]: layout.fixed,
        [`alain-default__collapsed`]: layout.collapsed,
      },
    )
    doc.body.classList[layout.colorWeak ? 'add' : 'remove']('color-weak')
  }

  ngAfterViewInit(): void {
    // Setting componet for only developer
    if (!environment.production) {
      setTimeout(() => {
        const settingFactory = this.resolver.resolveComponentFactory(SettingDrawerComponent)
        this.settingHost.createComponent(settingFactory)
      }, 10)
    }
    // Assistant component
    setTimeout(() => {
      const assistantFactory = this.resolver.resolveComponentFactory(AssistantDrawerComponent)
      this.assistant.createComponent(assistantFactory)
    }, 10)
  }

  ngOnInit() {
    const { settings, unsubscribe$ } = this
    settings.notify.pipe(takeUntil(unsubscribe$)).subscribe(() => this.setClass())
    this.setClass()
  }

  ngOnDestroy() {
    const { unsubscribe$ } = this
    unsubscribe$.next()
    unsubscribe$.complete()
  }
}
