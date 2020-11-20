import { Component, HostListener, OnInit } from '@angular/core'
import { I18NService } from '@core'
import { NgxChartService } from '@core/config/ngxchart.service'
import { AllHistogramResponse, CountService } from 'app/api/service/count.service'
import { NameValue } from 'app/model/common.model'
import { NzDrawerService } from 'ng-zorro-antd'

import { CountItemTrendComponent } from '../count-item-trend/count-item-trend.component'
import { CountI18nKeyMap } from '../system.config'


@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
})
export class CountComponent implements OnInit {

  coolColorScheme = this.chartService.coolColorScheme
  results: NameValue[] = []
  view = [window.innerWidth, window.innerHeight - 48]
  histogram: AllHistogramResponse

  @HostListener('window:resize')
  resize() {
    this.view = [window.innerWidth, window.innerHeight - 48]
  }
  constructor(
    private countService: CountService,
    private i18nService: I18NService,
    private drawerService: NzDrawerService,
    private chartService: NgxChartService,
  ) {
  }

  onSelect(item: NameValue) {
    this.drawerService.create({
      nzHeight: window.innerHeight * 0.4,
      nzContent: CountItemTrendComponent,
      nzContentParams: {
        item: item,
        histogram: this.histogram,
      },
      nzPlacement: 'bottom',
      nzBodyStyle: {
        padding: '0px'
      },
      nzClosable: false,
    })
  }

  ngOnInit() {
    this.countService.all().subscribe(res => {
      this.histogram = res.data.histogram
      const count = res.data.count
      const tmp: NameValue[] = []
      if (count) {
        for (const k of Object.keys(CountI18nKeyMap)) {
          tmp.push({ name: this.i18nService.fanyi(CountI18nKeyMap[k]), value: count[k], extra: k })
        }
      }
      this.results = tmp
    })
  }
}
