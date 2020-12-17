import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MonacoService } from '@core/config/monaco.service'
import { KarateCommandParams, UiService } from 'app/api/service/ui.service'

@Component({
  selector: 'app-karate-command',
  templateUrl: './karate-command.component.html',
  styleUrls: ['./karate-command.component.css']
})
export class KarateCommandComponent implements OnInit {

  editorOption = this.monocoService.getPlainTextOption(false)
  data: KarateCommandParams = {
    text: ''
  }

  _height = ''
  @Input() set height(val: string) {
    if (val) {
      this._height = val
    }
  }
  @Input() set params(params: KarateCommandParams) {
    if (params) {
      this.data = params
    } else {
      setTimeout(() => this.modelChange(), 1)
    }
  }
  @Output() paramsChange = new EventEmitter<KarateCommandParams>()

  constructor(
    private monocoService: MonacoService,
    private uiService: UiService,
  ) { }

  modelChange() {
    this.paramsChange.emit(this.data)
  }

  ngOnInit(): void {
  }

}
