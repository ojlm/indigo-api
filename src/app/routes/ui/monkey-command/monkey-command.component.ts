import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MonkeyCommandParams, UiService } from 'app/api/service/ui.service'

@Component({
  selector: 'app-monkey-command',
  templateUrl: './monkey-command.component.html',
  styleUrls: ['./monkey-command.component.css']
})
export class MonkeyCommandComponent implements OnInit {

  data: MonkeyCommandParams = {
    delta: 100,
    minOnceKeyCount: 1,
    maxOnceKeyCount: 5,
    cjkRatio: 1.0,
    keyEventRatio: 0.7,
    interval: 500,
    generateCount: 100,
    maxDuration: 0,
    areaRatio: [{}],
  }
  @Input() set params(params: MonkeyCommandParams) {
    if (params) {
      if (params.areaRatio) {
        this.data = params
      } else {
        this.data = { ...params, areaRatio: [{}] }
      }
    } else {
      setTimeout(() => this.modelChange(), 1)
    }
  }
  @Output() paramsChange = new EventEmitter<MonkeyCommandParams>()

  constructor(
    private uiService: UiService,
  ) { }

  addArea() {
    this.data.areaRatio.push({})
    this.modelChange()
  }

  removeArea(idx: number) {
    this.data.areaRatio.splice(idx, 1)
    this.modelChange()
  }

  modelChange() {
    this.paramsChange.emit(this.data)
  }

  ngOnInit(): void {
  }

}
