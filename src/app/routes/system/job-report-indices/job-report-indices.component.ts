import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CatIndicesResponse, SystemService } from 'app/api/service/system.service'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-job-report-indices',
  templateUrl: './job-report-indices.component.html',
})
export class JobReportIndicesComponent implements OnInit {

  items: CatIndicesResponse[] = []
  constructor(
    private systemService: SystemService,
    private msgService: NzMessageService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.systemService.getJobDataIndices().subscribe(res => {
      this.items = res.data
    })
  }
}
