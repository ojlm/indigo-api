import { Location } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core/i18n/i18n.service'
import { CaseService } from 'app/api/service/case.service'
import { Case } from 'app/model/es.model'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-delete-case',
  templateUrl: './delete-case.component.html',
  styles: []
})
export class DeleteCaseComponent implements OnInit {

  cs: Case = {}
  @Input()
  set data(val: Case) {
    if (val) {
      this.cs = val
      this.caseService.delete(this.cs._id, true).subscribe(res => {
        console.log(res.data)
      })
    }
  }

  constructor(
    private caseService: CaseService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }
}
