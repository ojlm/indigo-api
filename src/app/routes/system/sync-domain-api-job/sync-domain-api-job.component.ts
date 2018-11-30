import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { SyncDomainAndApiJobModel, SystemService } from 'app/api/service/system.service'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-sync-domain-api-job',
  templateUrl: './sync-domain-api-job.component.html',
})
export class SyncDomainApiJobComponent implements OnInit {

  form: FormGroup
  job: SyncDomainAndApiJobModel = {}

  constructor(
    private fb: FormBuilder,
    private systemService: SystemService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private location: Location,
  ) { }

  loadData() {
    this.systemService.getSyncDomainAndApiJobDetail().subscribe(res => {
      this.job = res.data
      this.form = this.fb.group({
        cron: [res.data.cron || '', [Validators.required]],
        day: [res.data.day || '', [Validators.required]],
        domainCount: [res.data.domainCount || '', [Validators.required]],
        apiCount: [res.data.apiCount || '', [Validators.required]],
      })
    })
  }

  update() {
    const job = this.form.value as SyncDomainAndApiJobModel
    if (job.day) {
      job.day = parseInt(job.day.toString(), 10)
    }
    this.systemService.updateSyncDomainAndApiJob(job).subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      this.loadData()
    })
  }

  canResume() {
    return 'PAUSED' === this.job.state
  }

  canPause() {
    return 'NORMAL' === this.job.state || 'COMPLETE' === this.job.state
  }

  resume() {
    this.systemService.resumeSyncDomainAndApiJob().subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      this.loadData()
    })
  }

  pause() {
    this.systemService.pauseSyncDomainAndApiJob().subscribe(res => {
      this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      this.loadData()
    })
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      cron: ['', [Validators.required]],
      day: ['', [Validators.required]],
      domainCount: ['', [Validators.required]],
      apiCount: ['', [Validators.required]],
    })
    this.loadData()
  }
}
