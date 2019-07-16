import { Component, HostListener, OnInit } from '@angular/core'
import { I18NService } from '@core'
import { CountService } from 'app/api/service/count.service'
import { NameValue } from 'app/model/common.model'

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
})
export class CountComponent implements OnInit {

  coolColorScheme = {
    domain: [
      '#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed', '#50abcc', '#ad6886'
    ]
  }
  results: NameValue[] = []
  view = [window.innerWidth, window.innerHeight - 48]

  @HostListener('window:resize')
  resize() {
    this.view = [window.innerWidth, window.innerHeight - 48]
  }
  constructor(
    private countService: CountService,
    private i18nService: I18NService,
  ) {
  }

  ngOnInit() {
    this.countService.all().subscribe(res => {
      const all = res.data
      this.results = [
        { name: this.i18nService.fanyi('count-http'), value: all.http },
        { name: this.i18nService.fanyi('count-dubbo'), value: all.dubbo },
        { name: this.i18nService.fanyi('count-sql'), value: all.sql },
        { name: this.i18nService.fanyi('count-scenario'), value: all.scenario },
        { name: this.i18nService.fanyi('count-job'), value: all.job },
        { name: this.i18nService.fanyi('count-web-http'), value: all.webHttp },
        { name: this.i18nService.fanyi('count-web-dubbo'), value: all.webDubbo },
        { name: this.i18nService.fanyi('count-web-sql'), value: all.webSql },
        { name: this.i18nService.fanyi('count-web-scenario'), value: all.webScenario },
        { name: this.i18nService.fanyi('count-web-job'), value: all.webJob },
        { name: this.i18nService.fanyi('count-ci-job'), value: all.ciJob },
        { name: this.i18nService.fanyi('count-quartz-job'), value: all.quartzJob },
      ]
    })
  }
}
