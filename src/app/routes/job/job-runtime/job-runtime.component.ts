import { Component, Input, OnInit } from '@angular/core'
import { MonacoService } from '@core/config/monaco.service'
import { formatJson } from 'app/util/json'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'app-steps-runtime',
  templateUrl: './job-runtime.component.html',
})
export class JobRuntimeComponent implements OnInit {

  _model = ''
  @Input()
  set init(val: object) {
    this._model = formatJson(val, 2)
  }
  @Input()
  set subject(val: Subject<object>) {
    if (val) {
      val.pipe(debounceTime(100)).subscribe(res => {
        this._model = formatJson(res, 2)
      })
    }
  }
  height = `${window.innerHeight}px`
  jsonEditorOption = this.monocoService.getJsonOption(true)

  constructor(
    private monocoService: MonacoService,
  ) { }

  ngOnInit(): void {
  }
}
