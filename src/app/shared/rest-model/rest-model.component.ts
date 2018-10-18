import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core/i18n/i18n.service'
import { Api } from 'app/model/es.model'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-rest-model',
  templateUrl: './rest-model.component.html',
  styles: []
})
export class RestModelComponent implements OnInit {

  fromSelector = false
  group: string
  project: string
  restId: string
  rest: Api = {}

  constructor(
    private fb: FormBuilder,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      if (!this.group && !this.project) {
        this.group = params['group']
        this.project = params['project']
      }
    })
    this.route.params.subscribe(params => {
      this.restId = params['restId']
    })
  }
}
