import { Component, Input, OnInit } from '@angular/core'
import { OnlineService } from 'app/api/service/online.service'
import { NameValue } from 'app/model/common.model'
import { RestApiOnlineLog } from 'app/model/es.model'
import { calcDrawerWidth } from 'app/util/drawer'

@Component({
  selector: 'app-api-metrics-trend',
  templateUrl: './api-metrics-trend.component.html',
})
export class ApiMetricsTrendComponent implements OnInit {

  result: NameValue[] = []
  item: RestApiOnlineLog = {}
  metricsKeys = ['min', 'avg', 'max', 'p25', 'p50', 'p75', 'p95', 'p99', 'p999']
  view: any[] = [calcDrawerWidth() - 40, window.innerHeight - 100]
  colorScheme = {
    domain: [
      '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'
    ]
  }

  @Input()
  set data(val: RestApiOnlineLog) {
    this.item = val
    this.onlineService.getApiPerfMetics({ domain: val.domain, method: val.method, urlPath: val.urlPath, size: 100 }).subscribe(res => {
      if (res.data && res.data.length > 0) {
        this.result = this.metricsKeys.filter(k => k !== 'max').map(metricsKey => {
          return {
            name: metricsKey,
            series: res.data.map(item => {
              return { name: item.date, value: item.metrics[metricsKey] || 0 }
            })
          }
        })
      }
    })
  }

  constructor(
    private onlineService: OnlineService,
  ) { }

  ngOnInit(): void {
  }
}
