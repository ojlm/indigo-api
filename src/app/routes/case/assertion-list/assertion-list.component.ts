import { Location } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { NzMessageService } from 'ng-zorro-antd'

import { CaseService } from '../../../api/service/case.service'
import { Assertion } from '../../../model/es.model'

@Component({
  selector: 'app-assertion-list',
  templateUrl: './assertion-list.component.html',
})
export class AssertionListComponent implements OnInit {

  @Input() assertions: Assertion[] = []
  @Input()
  get data() {
    return []
  }
  set data(objs: any[]) {
  }
  @Output()
  dataChange = new EventEmitter<any[]>()

  constructor(
    private caseService: CaseService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private monocoService: MonacoService,
  ) { }

  modelChange() {
    this.dataChange.emit(this.data)
  }

  ngOnInit(): void {
  }
}
