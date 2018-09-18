import { Location } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { Authorization, AuthorizeAndValidate } from '../../model/es.model'

@Component({
  selector: 'app-auth-selector',
  templateUrl: './auth-selector.component.html',
  styles: []
})
export class AuthSelectorComponent implements OnInit {

  authStyle = {
    'border': '1px solid lightgray',
    'padding': '3px',
    'border-radius': '5px',
    'height': '100px'
  }
  supports: AuthorizeAndValidate[] = [
    { type: 'basic', description: 'basic desc' },
    { type: 'ldap', description: 'ldap desc' }
  ]
  currentAuth: AuthorizeAndValidate
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

  authChange() {
    console.log(this.currentAuth)
  }

  add() {
    this.auth.push({ type: 'a' })
  }

  closeTag(i: number) {
    this.auth.splice(i, 1)
    console.log(this.auth)
  }

  constructor(
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }
}
