import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { I18NService } from '@core/i18n/i18n.service'
import { SystemService } from 'app/api/service/system.service'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-gitlab-sync',
  templateUrl: './gitlab-sync.component.html',
})
export class GitlabSyncComponent implements OnInit {

  constructor(
    private systemService: SystemService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }
}
