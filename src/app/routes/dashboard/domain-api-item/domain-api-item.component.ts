import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { GroupProject, RestApiOnlineLog } from 'app/model/es.model'
import { CaseModelHashObj } from 'app/routes/case/case-model/case-model.component'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-domain-api-item',
  templateUrl: './domain-api-item.component.html',
})
export class DomainApiItemComponent implements OnInit {

  isCoverd = false
  _item: RestApiOnlineLog = { belongs: [] }
  @Input()
  set item(val: RestApiOnlineLog) {
    if (val) {
      if (!val.belongs) {
        val.belongs = []
      } else {
        const idx = val.belongs.findIndex(item => item.covered)
        if (idx > -1) this.isCoverd = true
      }
      this._item = val
    }
  }

  createCase(item: GroupProject) {
    const caseModelHashObj: CaseModelHashObj = {
      domain: this._item.domain,
      urlPath: this._item.urlPath,
      method: this._item.method,
    }
    this.router.navigateByUrl(`/cases/${item.group}/${item.project}/new#${JSON.stringify(caseModelHashObj)}`)
  }

  stressTest(item: GroupProject) {
    this.msgService.info('In progress')
  }

  constructor(
    private route: ActivatedRoute,
    private msgService: NzMessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
}
