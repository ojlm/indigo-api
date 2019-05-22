import { Component, Input, OnInit } from '@angular/core'
import { StepStatusData } from 'app/api/service/scenario.service'

import { ScenarioStep } from '../../../model/es.model'
import { ScenarioStepData } from '../select-step/select-step.component'

@Component({
  selector: 'app-steps-runtime',
  styles: [],
  templateUrl: './steps-runtime.component.html',
})
export class StepsRuntimeComponent implements OnInit {

  @Input() steps: ScenarioStep[] = []
  @Input() stepsDataCache: { [k: string]: ScenarioStepData } = {}
  @Input() stepsStatusCache: { [k: number]: StepStatusData } = {}

  constructor(
  ) {
    console.log(this.steps, this.stepsDataCache, this.stepsStatusCache)
  }

  viewStep(idx: number, step: ScenarioStep) {

  }

  ngOnInit(): void {
  }
}
