import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core/i18n/i18n.service'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-dubbo-playground',
  templateUrl: './dubbo-playground.component.html',
})
export class DubboPlaygroundComponent implements OnInit {

  constructor(
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
  ) { }

  test() {
  }

  ngOnInit(): void {
  }
}
