import { Location } from '@angular/common'
import { Component, ElementRef, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MonacoService } from '@core/config/monaco.service'
import { I18NService } from '@core/i18n/i18n.service'
import { ClusterService, MemberInfo } from 'app/api/service/cluster.service'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-cluster-dashboard',
  templateUrl: './cluster-dashboard.component.html',
  styles: []
})
export class ClusterDashboardComponent implements OnInit {

  members: MemberInfo[] = []

  constructor(
    private clusterService: ClusterService,
    private monocoService: MonacoService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
    private el: ElementRef<HTMLDivElement>,
  ) { }

  ngOnInit(): void {
    this.clusterService.getMembers().subscribe(res => {
      this.members = res.data
    })
  }
}
