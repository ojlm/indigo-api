import { Component, HostListener, Input, OnInit } from '@angular/core'
import { I18NService } from '@core'
import { MonacoService } from '@core/config/monaco.service'
import { I18nKey } from '@core/i18n/i18n.message'
import { AutocompleteContext } from 'app/model/indigo.model'

import { ScenarioStep } from '../../../model/es.model'

@Component({
  selector: 'app-step-jump',
  templateUrl: './step-jump.component.html',
  styleUrls: ['./step-jump.component.css']
})
export class StepJumpComponent implements OnInit {

  tips = this.i18nService.fanyi(I18nKey.TipsJumpIndex)
  @Input() autocompleteContext = new AutocompleteContext()
  tabBarStyle = {
    'background-color': 'snow',
    'margin': '0px',
    'height': '40px'
  }
  scriptEditorHeight = `${window.innerHeight - 48}px`
  itemHeight = 240
  javascriptEditorOption = this.monocoService.getJavascriptOption(false)
  jsonEditorOption = this.monocoService.getJsonOption(false)
  @Input() data: JumpStepData = { step: { data: { jump: { script: '', conditions: [] } } } }
  @HostListener('window:resize')
  resizeBy() {
    this.scriptEditorHeight = `${window.innerHeight - 48}px`
  }
  constructor(
    private monocoService: MonacoService,
    private i18nService: I18NService,
  ) { }

  addItem() {
    this.data.step.data.jump.conditions.push({ assert: {}, to: this.data.index + 1 })
  }

  remove(i: number) {
    this.data.step.data.jump.conditions.splice(i, 1)
  }

  ngOnInit(): void {
  }
}

export interface JumpStepData {
  index?: number
  step?: ScenarioStep
}
