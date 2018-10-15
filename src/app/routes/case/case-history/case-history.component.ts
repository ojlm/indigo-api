import { Location } from '@angular/common'
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiRes } from 'app/model/api.model'
import { UserProfile } from 'app/model/user.model'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { CaseService, CaseWithSort, SearchAfterCase } from '../../../api/service/case.service'

@Component({
  selector: 'app-case-history',
  templateUrl: './case-history.component.html',
})
export class CaseHistoryComponent implements OnInit {

  style = this.getStyle()
  items = []
  total = undefined
  users: { [k: string]: UserProfile } = {}
  sort: any[] = []
  search: SearchAfterCase = {
    onlyMe: true,
  }
  searchSubject: Subject<SearchAfterCase>
  searchAfterResponse: Subject<ApiRes<CaseWithSort[]>> = new Subject()
  hasMore = true
  @Input() group: string
  @Input() project: string
  @Output() oncopy = new EventEmitter<CaseWithSort>()
  @Output() onedit = new EventEmitter<CaseWithSort>()
  @HostListener('window:resize')
  resize() {
    this.style = this.getStyle()
  }

  constructor(
    private caseService: CaseService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  copyItem(item: CaseWithSort) {
    this.oncopy.emit(item)
  }

  editItem(item: CaseWithSort) {
    this.onedit.emit(item)
  }

  getStyle() {
    return {
      'padding': '8px',
      'height': `${window.innerHeight}px`,
      'overflow': 'auto'
    }
  }

  checkChange() {
    this.resetState()
    this.doSearch()
  }

  textChange() {
    this.resetState()
    this.doSearch()
  }

  resetState() {
    this.hasMore = true
    this.items = []
    this.total = undefined
    this.users = {}
    this.sort = []
  }

  onScroll() {
    this.doSearch()
  }

  doSearch(force: boolean = false) {
    if (this.hasMore || force) {
      if (force) this.resetState()
      const search: SearchAfterCase = {
        ...this.search,
        group: this.group,
        project: this.project,
        size: 20,
        sort: this.sort,
      }
      this.searchSubject.next(search)
    }
  }

  trimDate(item: CaseWithSort) {
    if (item.createdAt && item.createdAt.length > 10) {
      return item.createdAt.substr(2, 8)
    } else {
      return ''
    }
  }

  userText(item: CaseWithSort) {
    const profile = this.users[item.creator]
    if (profile) {
      return (profile.nickname || profile.username)[0]
    } else {
      return ''
    }
  }

  userAvatar(item: CaseWithSort) {
    const profile = this.users[item.creator]
    if (profile) {
      return profile.avatar
    } else {
      return ''
    }
  }

  ngOnInit(): void {
    this.searchSubject = this.caseService.searchAfterSubject(this.searchAfterResponse)
    this.searchAfterResponse.subscribe(res => {
      this.items = [...this.items, ...res.data.list]
      this.total = res.data.total
      const newUser = res.data['users'] || {}
      for (const k of Object.keys(newUser)) {
        this.users[k] = newUser[k]
      }
      if (res.data.list.length > 0) {
        const last = res.data.list[res.data.list.length - 1]
        this.sort = last._sort
      }
      if (res.data.list.length < 20) {
        this.hasMore = false
      }
    })
    this.doSearch()
  }
}
