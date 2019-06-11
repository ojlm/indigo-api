import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FavoriteService } from 'app/api/service/favorite.service'
import { ScenarioStepType } from 'app/api/service/scenario.service'
import { NameValue } from 'app/model/common.model'
import { FavoriteTargetType, VariablesImportItem } from 'app/model/es.model'

@Component({
  selector: 'app-top-content',
  templateUrl: './top-content.component.html',
})
export class TopContentComponent implements OnInit {

  type = ''
  title = ''
  from: NameValue[] = []
  to: NameValue[] = []
  imports: VariablesImportItem[] = []
  url = ''

  constructor(
    private favoriteService: FavoriteService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  goExport() {
    this.router.navigateByUrl(this.url)
  }

  loadById(group: string, project: string, id: string) {
    this.favoriteService.getToptop(group, project, id).subscribe(res => {
      const response = res.data
      const tmp: NameValue[] = []
      if (response.scenario) {
        this.type = FavoriteTargetType.TARGET_TYPE_SCENARIO
        this.title = response.scenario.summary
        this.url = `/scenario/${response.scenario.group}/${response.scenario.project}/${response.scenario._id}`
        this.imports = response.scenario.imports || []
        response.scenario.steps.forEach((step, i) => {
          switch (step.type) {
            case ScenarioStepType.CASE:
              tmp.push({ name: response.case[step.id].summary, value: i })
              break;
            case ScenarioStepType.DUBBO:
              tmp.push({ name: response.dubbo[step.id].summary, value: i })
              break;
            case ScenarioStepType.SQL:
              tmp.push({ name: response.sql[step.id].summary, value: i })
              break;
            default:
              break;
          }
        })
      } else if (response.job) {
        this.type = FavoriteTargetType.TARGET_TYPE_JOB
        this.title = response.job.summary
        this.url = `/job/${response.job.group}/${response.job.project}/${response.job._id}`
        this.imports = response.job.imports || []
        response.job.jobData.scenario.forEach((step, i) => {
          tmp.push({ name: response.scenarios[step.id].summary, value: i })
        })
      }
      this.from = [...tmp]
      this.to = [...tmp]
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const topGroup = params['topGroup']
      const topProject = params['topProject']
      const topId = params['topId']
      if (topGroup && topProject && topId) { this.loadById(topGroup, topProject, topId) }
    })
  }
}
