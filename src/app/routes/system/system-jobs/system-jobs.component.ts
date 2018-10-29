import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-system-jobs',
  templateUrl: './system-jobs.component.html',
})
export class SystemJobsComponent implements OnInit {

  constructor(
    private msgService: NzMessageService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }
}
