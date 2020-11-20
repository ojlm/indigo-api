import { Component, Input, OnInit } from '@angular/core'
import { I18NService } from '@core'
import { NgxChartService } from '@core/config/ngxchart.service'
import { AggsItem } from 'app/api/service/base.service'
import { AllHistogramResponse } from 'app/api/service/count.service'
import { NameValue } from 'app/model/common.model'

import { CountI18nKeyMap } from '../system.config'

@Component({
  selector: 'app-count-item-trend',
  templateUrl: './count-item-trend.component.html',
})
export class CountItemTrendComponent implements OnInit {

  colorScheme = this.chartService.coolColorScheme
  results: NameValue[] = []
  view = [window.innerWidth, window.innerHeight * 0.4]

  @Input() item: NameValue
  @Input()
  set histogram(histogram: AllHistogramResponse) {
    this.results = [{ name: this.getName(), series: this.getSeries(histogram) }]
  }

  constructor(
    private i18nService: I18NService,
    private chartService: NgxChartService,
  ) {
  }

  getSeries(histogram: AllHistogramResponse) {
    if (this.item && histogram[this.item.extra]) {
      const tmp: NameValue[] = []
      histogram[this.item.extra].forEach((item: AggsItem, idx: number) => {
        if (idx > 0) {
          tmp.push({ name: item.id, value: item.count + tmp[idx - 1].value })
        } else {
          tmp.push({ name: item.id, value: item.count })
        }
      })
      return tmp
    } else {
      return []
    }
  }

  getName() {
    if (this.item && this.item.extra) {
      return this.i18nService.fanyi(CountI18nKeyMap[this.item.extra])
    } else {
      return ''
    }
  }

  ngOnInit() {
  }
}
