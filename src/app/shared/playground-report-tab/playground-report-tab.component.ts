import { Component, Input, OnInit } from '@angular/core'
import { CaseReportItemMetrics, CaseStatis } from 'app/model/es.model'

@Component({
  selector: 'app-playground-report-tab',
  styles: [`
    .metrics-item:not(:first-child) {
      padding-left: 10px;
    }
    .metrics-item .metrics-item-label {
      font-size: small;
      color: darkgray;
    }
    .metrics-item .metrics-item-value {
      font-size: small;
      color: lightseagreen;
    }
  `],
  templateUrl: './playground-report-tab.component.html',
})
export class PlaygroundReportTabComponent implements OnInit {

  hasResult = false
  _statis: CaseStatis = {}
  @Input()
  set statis(val: CaseStatis) {
    if (val && Object.keys(val).length > 0) {
      this._statis = val
      this.hasResult = true
    } else {
      this._statis = {}
      this.hasResult = false
    }
  }
  @Input() metrics: CaseReportItemMetrics = {}

  ngOnInit(): void {
  }
}
