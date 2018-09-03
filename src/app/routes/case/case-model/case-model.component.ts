import { Location } from '@angular/common'
import { Component, Input, OnInit, Output } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core/i18n/i18n.service'
import { EventEmitter } from 'events'
import { NzMessageService } from 'ng-zorro-antd'

import { GroupService } from '../../../api/service/group.service'
import { Case, KeyValueObject, METHODS } from '../../../model/es.model'
import { HttpContentTypes } from '../../../model/http.model'
import { searchToObj } from '../../../util/urlutils'

@Component({
  selector: 'app-case-model',
  styles: ['.affixed {transform:scale(1.03);;background-color:white;box-shadow:0px 0px 10px wheat;}'],
  templateUrl: './case-model.component.html',
})
export class CaseModelComponent implements OnInit {

  group: string
  project: string
  isAffixed = false
  @Input()
  get data() { return this.case }
  set data(val: Case) {
    const cs: Case = { ...val }
    if (!val._id) {
      initCaseField(cs)
    }
    this.case = cs
  }
  @Output() dataChange = new EventEmitter()
  case: Case = {}
  methods = METHODS
  tabIndex = 0

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
  ) { }

  onAffixChange(status: boolean) {
    this.isAffixed = status
  }

  urlChange() {
    let urlStr = this.case.request.rawUrl
    try {
      if (urlStr) {
        if (!(urlStr.startsWith('http://') || urlStr.startsWith('https://'))) {
          urlStr = `http://${urlStr}`
        }
        const url = new URL(urlStr)
        this.case.request.protocol = url.protocol.replace(':', '')
        this.case.request.host = url.hostname
        if (url.port) {
          this.case.request.port = parseInt(url.port, 10)
        } else {
          if (urlStr.startsWith('https://')) {
            this.case.request.port = 443
          } else {
            this.case.request.port = 80
          }
        }
        this.case.request.urlPath = url.pathname
        const searchObj = searchToObj(url.search.substr(1))
        const queryKvs: KeyValueObject[] = []
        for (const k in searchObj) {
          queryKvs.push({ key: k, value: searchObj[k], enabled: true })
        }
        this.case.request.query = queryKvs
      } else {
        this.case.request.protocol = undefined
        this.case.request.host = undefined
        this.case.request.port = undefined
        this.case.request.urlPath = undefined
        this.case.request.query = []
      }
    } catch (error) {
      this.msgService.warning(this.i18nService.fanyi('error-invalid-url'))
    }
  }

  paramsChange() {
    if (this.case.request.query.length > 0) {
      let search = '?'
      this.case.request.query.forEach(item => {
        if (item.enabled) {
          search += `${item.key || ''}=${item.value || ''}&`
        }
      })
      search = search.substr(0, search.length - 1)
      try {
        const rawUrl = this.case.request.rawUrl
        if (rawUrl && !rawUrl.startsWith('?')) {
          let hasProtocol = true
          let url: URL
          if (!(rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))) {
            hasProtocol = false
            url = new URL(`http://${rawUrl}`)
          } else {
            url = new URL(rawUrl)
          }
          url.search = search
          if (hasProtocol) {
            this.case.request.rawUrl = url.toString()
          } else {
            this.case.request.rawUrl = url.toString().replace('http://', '').replace('https://', '')
          }
        } else {
          this.case.request.rawUrl = search
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  send() {
    const cs = this.preHandleCaseBeforeRequest(this.case)
    console.log(cs)
  }

  save() {
    const cs = this.preHandleCaseBeforeRequest(this.case)
    console.log(cs)
  }

  saveAs() {
    const cs = this.preHandleCaseBeforeRequest(this.case)
    console.log(cs)
  }

  ngOnInit(): void {
    if (!this.case._id) {
      initCaseField(this.case)
    }
    this.route.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
    })
  }

  preHandleCaseBeforeRequest(cs: Case) {
    const c: Case = JSON.parse(JSON.stringify(cs))
    c.group = this.group
    c.project = this.project
    // handle reqeust
    const req = c.request
    if (req && req.body) {
      req.body.forEach(item => {
        if (HttpContentTypes.X_WWW_FORM_URLENCODED === item.contentType && item.data) {
          item.data = JSON.stringify(item.data)
        }
      })
    }
    return c
  }
}

export function initCaseField(cs: Case) {
  cs.request = {
    method: METHODS[0],
    contentType: 'application/x-www-form-urlencoded',
    body: [],
    auth: { type: '', data: {} }
  }
}
