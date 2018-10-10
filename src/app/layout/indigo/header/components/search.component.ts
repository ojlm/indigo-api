import { AfterViewInit, Component, ElementRef, HostBinding, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'

import { HomeDoc, HomeService, QueryHome } from '../../../../api/service/home.service'
import { ApiRes } from '../../../../model/api.model'

@Component({
  selector: 'header-search',
  template: `
    <nz-input-group nzAddOnBeforeIcon="anticon anticon-search">
      <input nz-input [(ngModel)]="q" (ngModelChange)="onSearch()" (focus)="qFocus()" (blur)="qBlur()"
        [placeholder]="'top-search-ph'|translate" [nzAutocomplete]="auto">
    </nz-input-group>
    <nz-autocomplete [nzDefaultActiveFirstOption]="false" #auto>
      <nz-auto-option *ngFor="let item of items" [nzValue]="q" [ngSwitch]="item._type">
        <div *ngSwitchCase="'group'" (click)="goItem(item)">
          <nz-tag [nzColor]="'lime'">{{'field-group'|translate}}</nz-tag>
          <span>{{item.summary}}</span>
        </div>
        <div *ngSwitchCase="'project'" (click)="goItem(item)">
          <nz-tag [nzColor]="'lime'">{{'field-project'|translate}}</nz-tag>
          <span>{{item.summary}}</span>
        </div>
        <div *ngSwitchCase="'rest'" (click)="goItem(item)">
          <nz-tag [nzColor]="'lime'">{{'field-api'|translate}}</nz-tag>
          <span>{{item.summary}}</span>
        </div>
        <div *ngSwitchCase="'case'" (click)="goItem(item)">
          <nz-tag [nzColor]="'lime'">{{'field-case'|translate}}</nz-tag>
          <span>{{item.summary}}</span>
        </div>
        <div *ngSwitchCase="'env'" (click)="goItem(item)">
          <nz-tag [nzColor]="'lime'">{{'field-env'|translate}}</nz-tag>
          <span>{{item.summary}}</span>
        </div>
        <div *ngSwitchCase="'scenario'" (click)="goItem(item)">
          <nz-tag [nzColor]="'lime'">{{'field-scenario'|translate}}</nz-tag>
          <span>{{item.summary}}</span>
        </div>
        <div *ngSwitchCase="'job'" (click)="goItem(item)">
          <nz-tag [nzColor]="'lime'">{{'field-job'|translate}}</nz-tag>
          <span>{{item.summary}}</span>
        </div>
      </nz-auto-option>
    </nz-autocomplete>
  `
})
export class HeaderSearchComponent implements AfterViewInit {

  q: string

  qIpt: HTMLInputElement

  @HostBinding('class.header-search__focus')
  focus = false

  @HostBinding('class.header-search__toggled')
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
      this.items = res.data
    })
    this.querySubject = homeService.newQuerySubject(response)
  }

  onSearch() {
    if (this.q) {
      this.querySubject.next({ text: this.q })
    }
  }

  goItem(item: HomeDoc) {
    switch (item._type) {
      case 'group':
        this.router.navigateByUrl(`/${item._id}`)
        break
      case 'project':
        this.router.navigateByUrl(`/${item.group}/${item._id}`)
        break
      case 'rest':
        this.router.navigateByUrl(`/api/${item.group}/${item.project}/${item._id}`)
        break
      case 'case':
        this.router.navigateByUrl(`/case/${item.group}/${item.project}/${item._id}`)
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
