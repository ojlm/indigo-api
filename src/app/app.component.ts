import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { TitleService, VERSION as VERSION_ALAIN } from '@delon/theme'
import { NzModalService, VERSION as VERSION_ZORRO } from 'ng-zorro-antd'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private router: Router,
    private titleSrv: TitleService,
    private modalSrv: NzModalService,
  ) {
    renderer.setAttribute(
      el.nativeElement,
      'ng-alain-version',
      VERSION_ALAIN.full,
    )
    renderer.setAttribute(
      el.nativeElement,
      'ng-zorro-version',
      VERSION_ZORRO.full,
    )
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => {
        this.titleSrv.setTitle()
        this.modalSrv.closeAll()
      })
  }
}
