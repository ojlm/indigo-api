import { Component, OnInit } from '@angular/core'
import { CaseService } from 'app/api/service/case.service'

import { NameValue } from '../report/job-report-model/job-report-model.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  title = ['🌇', '🌆', '🏙', '🌃', '🌉', '🌌', '🌠', '🎆', '🌈', '🌅', '🎑', '🏞']
  results: NameValue[] = [{ name: 'indigo', value: 0 }]
  view: any[] = undefined
  colorScheme = {
    domain: ['lightslategray', 'snow', 'whitesmoke']
  }

  constructor(
    private caseService: CaseService,
  ) {
    this.caseService.aggs({}).subscribe(res => {
      this.results = res.data.map(item => {
        return { name: item.id, value: item.count }
      })
    })
  }

  onSelect(item: any) {
    console.log(item)
  }

  shuffle() {
    for (let i = this.title.length; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const t = this.title[i]
      this.title[i] = this.title[j]
      this.title[j] = t
    }
  }

  ngOnInit() {
    this.shuffle()
  }
}
