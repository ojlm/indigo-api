import { Component, Input, OnInit } from '@angular/core'
import { GroupProjectSelectorModel } from '@shared/group-project-selector/group-project-selector.component'
import { JobService, QueryJob } from 'app/api/service/job.service'
import { jobToScenarioStep } from 'app/api/service/scenario.service'
import { ApiRes } from 'app/model/api.model'
import { PageSingleModel } from 'app/model/page.model'
import { Subject } from 'rxjs'

import { Job } from '../../../model/es.model'
import { StepEvent } from '../select-step/select-step.component'

@Component({
  selector: 'app-select-job',
  styles: [`
    .search-group-project {
      margin-bottom: 8px;
    }
   `
  ],
  templateUrl: './select-job.component.html',
})
export class SelectJobComponent implements OnInit {

  @Input()
  set group(val: string) {
    this.searchGroupProject.group = val
  }
  @Input()
  set project(val: string) {
    this.searchGroupProject.project = val
  }
  tabIndex = 0
  searchGroupProject: GroupProjectSelectorModel

  jobItems: Job[] = []
  jobItemsPage = new PageSingleModel()
  searchJobModel: QueryJob = {}
  searchJobSubject: Subject<Job>

  @Input() onSelectSubject: Subject<StepEvent>

  constructor(
    private jobService: JobService,
  ) {
    this.searchGroupProject = {
      group: this.group,
      project: this.project
    }
  }

  groupProjectChange() {
    this.searchJob()
  }

  select(item: Job) {
    if (this.onSelectSubject) {
      this.onSelectSubject.next({
        step: jobToScenarioStep(item),
        stepData: item
      })
    }
  }

  searchJob() {
    this.searchJobSubject.next({
      ...this.searchJobModel, ...this.jobItemsPage.toPageQuery(), ...this.searchGroupProject
    })
  }

  ngOnInit(): void {
    const response = new Subject<ApiRes<Job[]>>()
    response.subscribe(res => {
      this.jobItemsPage.pageTotal = res.data.total
      this.jobItems = res.data.list
    })
    this.searchJobSubject = this.jobService.newQuerySubject(response)
    this.searchJob()
  }
}
