import { Component, Input, OnInit } from '@angular/core'
import { getScenarioStepCacheKey, isExportItemValid, StepStatusData } from 'app/api/service/scenario.service'
import { ScenarioStep } from 'app/model/es.model'
import { ScenarioStepData } from 'app/routes/scenario/select-step/select-step.component'
import { getJsonPathValueAsString } from 'app/util/jsonpath'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'app-steps-runtime',
  styles: [`
    .th {
      padding:3px;
      width: 20%;
    }
    .td {
      padding:2px;
      width: 20%;
    }
  `],
  templateUrl: './steps-runtime.component.html',
})
export class StepsRuntimeComponent implements OnInit {

  items: RuntimeVariableItem[] = []
  _subject: Subject<any>
  @Input()
  set subject(val: Subject<any>) {
    if (val) {
      this._subject = val
      this._subject.pipe(debounceTime(100)).subscribe(_ => {
        this.rebuildItems()
      })
    }
  }
  _steps: ScenarioStep[] = []
  @Input()
  set steps(val: ScenarioStep[]) {
    if (val && this._subject) {
      this._steps = val
      this._subject.next()
    }
  }
  _stepsDataCache: { [k: string]: ScenarioStepData } = {}
  @Input()
  set stepsDataCache(val: { [k: string]: ScenarioStepData }) {
    if (val && this._subject) {
      this._stepsDataCache = val
      this._subject.next()
    }
  }
  _stepsStatusCache: { [k: number]: StepStatusData }
  @Input()
  set stepsStatusCache(val: { [k: number]: StepStatusData }) {
    if (val && this._subject) {
      this._stepsStatusCache = val
      this._subject.next()
    }
  }
  @Input() view: Function
  @Input() simple = false

  constructor(
  ) { }

  rebuildItems() {
    const items: RuntimeVariableItem[] = []
    if (this._steps.length > 0 && this._stepsDataCache && this._stepsStatusCache) {
      for (let i = 0; i < this._steps.length; ++i) {
        const step = this._steps[i]
        const stepData = this._stepsDataCache[getScenarioStepCacheKey(step)]
        const statusData = this._stepsStatusCache[i]
        let ctxData = null
        let status = null
        if (stepData && stepData.exports && statusData && statusData.report && statusData.report.result) {
          ctxData = statusData.report.result.context
          status = statusData.report.status
          const title = stepData.summary
          const item: RuntimeVariableItem = {
            stepIdx: i,
            title: title,
            status: status,
            exports: []
          }
          const renderedExportDesc = statusData.report.result.renderedExportDesc
          stepData.exports.forEach((exportItem, subIdex) => {
            if (isExportItemValid(exportItem)) {
              let value = ''
              if (ctxData) {
                value = getJsonPathValueAsString(`$.${exportItem.scope}.${exportItem.dstName}`, ctxData)
              }
              let description = exportItem.description
              if (renderedExportDesc && renderedExportDesc[subIdex]) {
                description = renderedExportDesc[subIdex]
              }
              item.exports.push({ ...exportItem, value: value, description: description })
            }
          })
          items.push(item)
        }
      }
    }
    this.items = items
  }

  viewStep(item: RuntimeVariableItem) {
    if (this.view) {
      this.view(item.stepIdx)
    }
  }

  stepHasResult(item: RuntimeVariableItem) {
    return (item.status === 'pass' || item.status === 'fail') && (item.exports && item.exports.length > 0)
  }

  ngOnInit(): void {
  }
}

export interface RuntimeVariableItem {
  stepIdx?: number
  title?: string
  status?: string
  exports?: {
    srcPath?: string
    dstName?: string
    scope?: string
    description?: string
    value?: any
  }[]
}
