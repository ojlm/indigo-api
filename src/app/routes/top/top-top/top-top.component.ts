import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-top-top',
  templateUrl: './top-top.component.html',
})
export class TopTopComponent implements OnInit {

  constructor(
    private msgService: NzMessageService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
  }
}
