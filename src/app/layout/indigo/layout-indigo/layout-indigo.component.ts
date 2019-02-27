import { DOCUMENT } from '@angular/common'
import { Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2 } from '@angular/core'
import { Router } from '@angular/router'
import { SettingsService } from '@delon/theme'
import { NzMessageService } from 'ng-zorro-antd'

import { LayoutAbstractClass } from '../layout-abstract.class'

@Component({
  selector: 'layout-indigo',
  templateUrl: './layout-indigo.component.html',
})
export class LayoutIndigoComponent extends LayoutAbstractClass {

  constructor(
    router: Router,
    _message: NzMessageService,
    resolver: ComponentFactoryResolver,
    settings: SettingsService,
    el: ElementRef,
    renderer: Renderer2,
    @Inject(DOCUMENT) doc: any,
  ) {
    super(router, _message, resolver, settings, el, renderer, doc)
  }
}
