import { Location } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { CaseService } from '../../../api/service/case.service'

@Component({
  selector: 'app-case-history',
  templateUrl: './case-history.component.html',
})
export class CaseHistoryComponent implements OnInit {


  @Input() group: string
  @Input() project: string
  @Output() onclick = new EventEmitter<string>()

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }
}
