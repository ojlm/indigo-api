import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { I18NService } from '@core/i18n/i18n.service'
import { SystemService } from 'app/api/service/system.service'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-system-jobs',
  templateUrl: './system-jobs.component.html',
})
export class SystemJobsComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private systemService: SystemService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }
}
