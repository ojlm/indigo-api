import { Location } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService } from 'ng-zorro-antd'

import { EnvService } from '../../api/service/env.service'
import { Authorization, AuthorizeAndValidate } from '../../model/es.model'
import { formatJson } from '../../util/json'

@Component({
  selector: 'app-auth-selector',
  templateUrl: './auth-selector.component.html',
  styles: []
})
export class AuthSelectorComponent implements OnInit {

  jsonEditorOption = this.monocoService.getJsonOption(false)
  authHeight = 200
  markdown = ''
  authStyle = {
    'border': '1px solid lightgray',
    'padding': '3px',
    'border-radius': '5px',
    'height': `${this.authHeight + 6}px`
  }
  supports: AuthorizeAndValidate[] = []
  currentAuth: AuthorizeAndValidate
  currentData = ''
  selectedIndex: number
  selectedAuth: Authorization
  auth: Authorization[] = []
  @Input()
  set data(value: Authorization[]) {
    if (value && value.length > 0) {
      this.auth = value
      this.activateTag(this.auth[0], 0)
    }
    if (this.supports && this.supports.length < 1) {
      this.envService.getAllAuth().subscribe(res => {
        this.supports = res.data
        if (this.auth && this.auth.length > 0) {
          this.activateTag(this.auth[0], 0)
        }
      })
    }
  }
  get data() {
    return this.auth
  }
  @Output()
  dataChange = new EventEmitter<Authorization[]>()

  authChange() {
    if (this.currentAuth) {
      this.markdown = this.currentAuth.description
      this.currentData = this.currentAuth.template
      this.selectedAuth = undefined
      this.selectedIndex = undefined
    }
  }

  currentDataChange() {
    if (this.selectedAuth && this.currentData) {
      try {
        const data = JSON.parse(this.currentData)
        this.selectedAuth.data = data
        this.dataChange.emit(this.data)
      } catch (error) { }
    }
  }

  add() {
    if (this.currentAuth && this.currentAuth.type) {
      try {
        const data = JSON.parse(this.currentData)
        const newAuth = { type: this.currentAuth.type, data: data }
        this.auth.push(newAuth)
        this.activateTag(newAuth, this.auth.length - 1)
        this.dataChange.emit(this.data)
      } catch (error) {
        console.error(error)
        this.msgService.error(this.i18nService.fanyi(I18nKey.ErrorInvalidJson))
      }
    }
  }

  tagColor(index: number) {
    if (index === this.selectedIndex) {
      return '#108ee9'
    } else {
      return 'blue'
    }
  }

  closeTag(index: number) {
    if (index === this.selectedIndex && undefined !== this.selectedIndex) {
      if (this.auth && this.auth.length > 0) {
        this.activateTag(this.auth[0], 0)
      }
    }
    this.auth.splice(index, 1)
    this.dataChange.emit(this.data)
  }

  activateTag(item: Authorization, index: number) {
    this.currentAuth = undefined
    this.selectedAuth = item
    this.selectedIndex = index
    const sup = this.supports.find(a => a.type === item.type)
    this.markdown = sup.description
    this.currentData = formatJson(item.data)
  }

  constructor(
    private monocoService: MonacoService,
    private envService: EnvService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }
}
