import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { DomainOnlineConfig } from 'app/model/es.model'
import { NzDrawerRef } from 'ng-zorro-antd'

@Component({
  selector: 'app-domain-online-config',
  templateUrl: './domain-online-config.component.html',
})
export class DomainOnlineConfigComponent implements OnInit {

  config: DomainOnlineConfig = {}
  @Input()
  set data(val: string) {
    this.config.domain = val || ''
  }
  constructor(
    private drawerRef: NzDrawerRef<any>,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
}
