import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { OnlineService, QueryDomainWildcard } from 'app/api/service/online.service'
import { ApiRes } from 'app/model/api.model'
import { DomainOnlineLog, LabelRef, Project } from 'app/model/es.model'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { ProjectService } from '../../../api/service/project.service'

@Component({
  selector: 'app-project-sync-settings',
  templateUrl: './project-sync-settings.component.html',
})
export class ProjectSyncSettingsComponent implements OnInit {

  group = ''
  project = ''
  searchText = ''
  domains: LabelRef[] = [{ name: '' }]
  queryDomainSubject: Subject<QueryDomainWildcard>
  domainLogs: DomainOnlineLog[] = []

  constructor(
    private projectService: ProjectService,
    private msgService: NzMessageService,
    private onlineService: OnlineService,
    private router: Router,
    private i18nService: I18NService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    const domainResponse = new Subject<ApiRes<DomainOnlineLog[]>>()
    this.queryDomainSubject = this.onlineService.queryDomainWildcardSubject(domainResponse)
    domainResponse.subscribe(res => {
      const idx = res.data.list.findIndex(item => item.name === this.searchText)
      if (idx > -1) {
        this.domainLogs = res.data.list
      } else {
        this.domainLogs = [{ name: this.searchText }, ...res.data.list]
      }
    })
  }

  searchDomain(domain: string) {
    if (domain) {
      this.searchText = domain
      this.queryDomainSubject.next({ domain: domain })
    }
  }

  add() {
    this.domains.push({ name: '' })
  }

  save() {
    if (this.group && this.project) {
      const filtered = this.domains.filter(item => item.name)
      const p: Project = {
        id: this.project,
        group: this.group,
        domains: filtered
      }
      this.projectService.update(p).subscribe(res => {
        if (filtered.length !== this.domains.length) {
          this.domains = filtered
        }
        this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
      })
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.group = param.get('group')
      this.project = param.get('project')
      if (this.group && this.project) {
        this.projectService.getById(this.group, this.project).subscribe(res => {
          const project = res.data
          if (project.domains && project.domains.length > 0) {
            this.domains = project.domains
            this.domains.forEach(item => {
              this.domainLogs.push({ name: item.name })
            })
          }
        })
      }
    })
  }
}
