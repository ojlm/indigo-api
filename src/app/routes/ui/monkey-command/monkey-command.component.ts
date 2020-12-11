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
    maxOnceKeyCount: 5,
    keyEventRatio: 0.7,
    interval: 500,
    generateCount: 100,
    maxDuration: 0
  }
  @Input() set params(params: MonkeyCommandParams) {
    if (params) {
      this.data = params
    } else {
      setTimeout(() => this.modelChange(), 1)
    }
  }
  @Output() paramsChange = new EventEmitter<MonkeyCommandParams>()

  constructor(
    private uiService: UiService,
  ) { }

  modelChange() {
    this.paramsChange.emit(this.data)
  }

  ngOnInit(): void {
  }

}
