import { Location } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService } from 'ng-zorro-antd'

import { EnvService } from '../../api/service/env.service'
import { Authorization, AuthorizeAndValidate } from '../../model/es.model'

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
  auth: Authorization[] = []
  @Input()
  set data(value: Authorization[]) {
    if (value && value.length > 0) {
      this.auth = value
    }
  }
  get data() {
    return this.auth
  }
  @Output()
  dataChange = new EventEmitter<Authorization[]>()

  authChange() {
    this.markdown = this.currentAuth.description
  }

  add() {
    if (this.currentAuth && this.currentAuth.type) {
      try {
        const data = JSON.parse(this.currentData)
        this.auth.push({ type: this.currentAuth.type, data: data })
        this.dataChange.emit(this.data)
      } catch (error) {
        console.error(error)
        this.msgService.error(this.i18nService.fanyi(I18nKey.ErrorInvalidJson))
      }
    }
  }

  closeTag(i: number) {
    this.auth.splice(i, 1)
    this.dataChange.emit(this.data)
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
    this.envService.getAllAuth().subscribe(res => {
      this.supports = res.data
    })
  }
}
