import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { AggsItem } from 'app/api/service/base.service'
import { CaseService } from 'app/api/service/case.service'
import { DubboService } from 'app/api/service/dubbo.service'
import { JobService } from 'app/api/service/job.service'
import { ScenarioService, ScenarioStepType } from 'app/api/service/scenario.service'
import { SqlService } from 'app/api/service/sql.service'
import { ApiRes } from 'app/model/api.model'
import { Subject } from 'rxjs'

import { LabelRef } from '../../model/es.model'

@Component({
  selector: 'app-label-list',
  templateUrl: './label-list.component.html',
})
export class LabelListComponent implements OnInit {

  labels: AggsItem[] = []
  isEditable = false
  values: string[] = []
  response = new Subject<ApiRes<AggsItem[]>>()
  queryLabelSubject: Subject<string>
  @Input() group = ''
  @Input() project = ''
  @Input()
  set type(val: string) {
    if (!this.queryLabelSubject) {
      switch (val) {
        case ScenarioStepType.DUBBO:
          this.queryLabelSubject = this.dubboService.aggsLabelsSubject(this.group, this.project, this.response)
          break
        case ScenarioStepType.SQL:
          this.queryLabelSubject = this.sqlService.aggsLabelsSubject(this.group, this.project, this.response)
          break
        case ScenarioStepType.CASE:
          this.queryLabelSubject = this.caseService.aggsLabelsSubject(this.group, this.project, this.response)
          break
        case ScenarioStepType.SCENARIO:
          this.queryLabelSubject = this.scenarioService.aggsLabelsSubject(this.group, this.project, this.response)
          break
        case ScenarioStepType.JOB:
          this.queryLabelSubject = this.jobService.aggsLabelsSubject(this.group, this.project, this.response)
          break
        default:
          break
      }
      this.response.subscribe(res => {
        this.labels = res.data
      })
    }
  }
  @Input()
  get data() {
    return this.values.map(item => {
      return { name: item }
    })
  }
  set data(val: LabelRef[]) {
    if (val) {
      this.values = val.map(item => item.name)
    }
  }
  @Output()
  dataChange = new EventEmitter<LabelRef[]>()

  constructor(
    private caseService: CaseService,
    private dubboService: DubboService,
    private sqlService: SqlService,
    private scenarioService: ScenarioService,
    private jobService: JobService,
  ) {
  }

  labelSelectOpenChange() {
    if (this.labels.length === 0) {
      this.searchLabel('')
    }
  }

  modelChange() {
    this.dataChange.emit(this.data)
  }

  confirm() {
    this.isEditable = false
  }

  searchLabel(label: string) {
    this.queryLabelSubject.next(label)
  }

  remove(item: LabelRef, index: number) {
    this.values.splice(index, 1)
    this.modelChange()
  }

  ngOnInit(): void {
  }
}
