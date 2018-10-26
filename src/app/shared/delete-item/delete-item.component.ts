import { Location } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core/i18n/i18n.service'
import { CaseService } from 'app/api/service/case.service'
import { ScenarioService } from 'app/api/service/scenario.service'
import { Case, Job, Scenario } from 'app/model/es.model'
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
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
export class DeleteItemComponent implements OnInit {

  cs: Case = {}
  scenario: Scenario = {}
  scenarios: Scenario[] = []
  scenariosTotal = 0
  jobs: Job[] = []
  jobsTotal = 0
  item: DeleteItemType = { type: 'case' }
  @Input()
  set data(val: DeleteItemType) {
    if (val) {
      this.item = val
      if ('case' === this.item.type) {
        this.cs = val.value
        this.caseService.delete(this.cs._id, true).subscribe(res => {
          this.jobs = res.data.job.list
          this.jobsTotal = res.data.job.total
          this.scenarios = res.data.scenario.list
          this.scenariosTotal = res.data.scenario.total
        })
      }
      if ('scenario' === this.item.type) {
        this.scenario = val.value
        this.scenarioService.delete(this.scenario._id, true).subscribe(res => {
          this.jobs = res.data.job.list
          this.jobsTotal = res.data.job.total
        })
      }
    }
  }

  constructor(
    private caseService: CaseService,
    private scenarioService: ScenarioService,
    private drawerRef: NzDrawerRef<any>,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  delete() {
    if ('case' === this.item.type) {
      this.caseService.delete(this.cs._id, false).subscribe(res => {
        this.drawerRef.close(res)
      })
    } else if ('scenario' === this.item.type) {
      this.scenarioService.delete(this.scenario._id, false).subscribe(res => {
        this.drawerRef.close(res)
      })
    }
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

export interface DeleteItemType {
  type?: string
  value?: any
}
