import { Location } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core/i18n/i18n.service'
import { CaseService } from 'app/api/service/case.service'
import { Case, Job, Scenario } from 'app/model/es.model'
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-delete-case',
  templateUrl: './delete-case.component.html',
  styles: [`
    .divider-text {
      font-size: small;
      color: gray;
    }
    .item {
      padding-left: 8px;
    }
  `]
})
export class DeleteCaseComponent implements OnInit {

  jobs: Job[] = []
  jobsTotal = 0
  scenarios: Scenario[] = []
  scenariosTotal = 0
  cs: Case = {}
  @Input()
  set data(val: Case) {
    if (val) {
      this.cs = val
      this.caseService.delete(this.cs._id, true).subscribe(res => {
        this.jobs = res.data.job.list
        this.jobsTotal = res.data.job.total
        this.scenarios = res.data.scenario.list
        this.scenariosTotal = res.data.scenario.total
      })
    }
  }

  constructor(
    private caseService: CaseService,
    private drawerRef: NzDrawerRef<any>,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  delete() {
    this.caseService.delete(this.cs._id, false).subscribe(res => {
      this.drawerRef.close(res)
    })
  }

  goScenario(scenario: Scenario) {
    this.drawerRef.close(null)
    this.router.navigateByUrl(`/scenario/${scenario.group}/${scenario.project}/${scenario._id}`)
  }

  goJob(job: Job) {
    this.drawerRef.close(null)
    this.router.navigateByUrl(`/job/${job.group}/${job.project}/${job._id}`)
  }

  ngOnInit(): void {
  }
}
