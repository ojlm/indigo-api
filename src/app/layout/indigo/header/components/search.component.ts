import { AfterViewInit, Component, ElementRef, HostBinding, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'

import { HomeDoc, HomeService, QueryHome } from '../../../../api/service/home.service'
import { ApiRes } from '../../../../model/api.model'

@Component({
  selector: 'header-search',
  template: `
    <nz-input-group nzAddOnBeforeIcon="search">
      <input nz-input [(ngModel)]="q" (ngModelChange)="onSearch()" (focus)="qFocus()" (blur)="qBlur()"
        [placeholder]="'top-search-ph'|translate" [nzAutocomplete]="auto">
    </nz-input-group>
    <nz-autocomplete [nzDefaultActiveFirstOption]="false" #auto>
      <nz-auto-option *ngFor="let item of items" [nzValue]="q" [ngSwitch]="item._type">
        <div *ngSwitchCase="'group'" (click)="goItem(item)">
          <span class="item-t">{{'field-group'|translate}}</span>
          <span>{{item.summary}}</span>
        </div>
        <div *ngSwitchCase="'project'" (click)="goItem(item)">
          <span class="item-t">{{'field-project'|translate}}</span>
          <span>{{item.summary}}</span>
        </div>
        <div *ngSwitchCase="'rest'" (click)="goItem(item)">
          <span class="item-t">{{'field-api'|translate}}</span>
          <span class="item-g-p">{{item.group}} / {{item.project}}</span>
          <div class="item-s">{{item.summary}}</div>
        </div>
        <div *ngSwitchCase="'case'" (click)="goItem(item)">
          <span class="item-t">{{'field-case'|translate}}</span>
          <span class="item-g-p">{{item.group}} / {{item.project}}</span>
          <div class="item-s">{{item.summary}}</div>
        </div>
        <div *ngSwitchCase="'dubbo'" (click)="goItem(item)">
          <span class="item-t">{{'field-dubbo'|translate}}</span>
          <span class="item-g-p">{{item.group}} / {{item.project}}</span>
          <div class="item-s">{{item.summary}}</div>
        </div>
        <div *ngSwitchCase="'sql'" (click)="goItem(item)">
          <span class="item-t">{{'field-sql'|translate}}</span>
          <span class="item-g-p">{{item.group}} / {{item.project}}</span>
          <div class="item-s">{{item.summary}}</div>
        </div>
        <div *ngSwitchCase="'env'" (click)="goItem(item)">
          <span class="item-t">{{'field-env'|translate}}</span>
          <span class="item-g-p">{{item.group}} / {{item.project}}</span>
          <div class="item-s">{{item.summary}}</div>
        </div>
        <div *ngSwitchCase="'scenario'" (click)="goItem(item)">
          <span class="item-t">{{'field-scenario'|translate}}</span>
          <span class="item-g-p">{{item.group}} / {{item.project}}</span>
          <div class="item-s">{{item.summary}}</div>
        </div>
        <div *ngSwitchCase="'job'" (click)="goItem(item)">
          <span class="item-t">{{'field-job'|translate}}</span>
          <span class="item-g-p">{{item.group}} / {{item.project}}</span>
          <div class="item-s">{{item.summary}}</div>
        </div>
        <div *ngSwitchDefault>
          <div class="item-s">{{item.summary}}</div>
        </div>
      </nz-auto-option>
    </nz-autocomplete>
  `,
  styles: [`
    .item-t {
      box-shadow: 0px 0px 3px lightgrey;
      padding:4px;
      background-color: wheat;
      margin-right: 8px;
    }
    .item-g-p {
      color: lightgray;
    }
    .item-s {
      white-space:normal;
      padding-left:4px;
    }
  `]
})
export class HeaderSearchComponent implements AfterViewInit {

  q: string

  qIpt: HTMLInputElement

  @HostBinding('class.alain-default__search-focus')
  focus = false

  @HostBinding('class.alain-default__search-toggled')
  searchToggled = false

  @Input()
  set toggleChange(value: boolean) {
    if (typeof value === 'undefined') return
    this.searchToggled = true
    this.focus = true
    setTimeout(() => this.qIpt.focus(), 300)
  }

  querySubject: Subject<QueryHome>
  items: HomeDoc[] = []

  constructor(
    private el: ElementRef,
    private homeService: HomeService,
    private router: Router,
  ) {
    const response = new Subject<ApiRes<HomeDoc[]>>()
    response.subscribe(res => {
      if (res.data.length === 0) {
        this.items = [{ summary: 'No data available' }]
      } else {
        this.items = res.data
      }
    })
    this.querySubject = homeService.newQuerySubject(response)
  }

  onSearch() {
    this.querySubject.next({ text: this.q })
  }

  goItem(item: HomeDoc) {
    switch (item._type) {
      case 'group':
        this.router.navigateByUrl(`/${item._id}`)
        break
      case 'project':
        this.router.navigateByUrl(`/${item.group}/${item.id}`)
        break
      case 'rest':
        this.router.navigateByUrl(`/rest/${item.group}/${item.project}/${item._id}`)
        break
      case 'case':
        this.router.navigateByUrl(`/case/${item.group}/${item.project}/${item._id}`)
        break
      case 'dubbo':
        this.router.navigateByUrl(`/dubbo/${item.group}/${item.project}/${item._id}`)
        break
      case 'sql':
        this.router.navigateByUrl(`/sql/${item.group}/${item.project}/${item._id}`)
        break
      case 'env':
        this.router.navigateByUrl(`/env/${item.group}/${item.project}/${item._id}`)
        break
      case 'scenario':
        this.router.navigateByUrl(`/scenario/${item.group}/${item.project}/${item._id}`)
        break
      case 'job':
        this.router.navigateByUrl(`/job/${item.group}/${item.project}/${item._id}`)
        break
      default:
    }
  }

  ngAfterViewInit() {
    this.qIpt = (this.el.nativeElement as HTMLElement).querySelector('.ant-input') as HTMLInputElement
  }

  qFocus() {
    this.focus = true
  }

  qBlur() {
    this.focus = false
    this.searchToggled = false
  }
}
