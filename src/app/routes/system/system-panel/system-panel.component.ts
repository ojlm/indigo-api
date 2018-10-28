import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CatIndicesResponse } from 'app/api/service/system.service'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-system-panel',
  templateUrl: './system-panel.component.html',
})
export class SystemPanelComponent implements OnInit {

  items: CatIndicesResponse[] = []
  constructor(
    private msgService: NzMessageService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }
}
