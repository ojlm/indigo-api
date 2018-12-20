import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { LabelRef, Project } from 'app/model/es.model'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { ProjectService } from '../../../api/service/project.service'

@Component({
  selector: 'app-project-sync-settings',
  templateUrl: './project-sync-settings.component.html',
})
export class ProjectSyncSettingsComponent implements OnInit {

  group = ''
  project = ''
  domain = ''

  constructor(
    private projectService: ProjectService,
    private msgService: NzMessageService,
    private router: Router,
    private i18nService: I18NService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private location: Location,
  ) {
  }

  save() {
    if (this.group && this.project) {
      let domains: LabelRef[] = []
      if (this.domain) {
        domains = [{ name: this.domain }]
      }
      const p: Project = {
        id: this.project,
        group: this.group,
        domains: domains
      }
      this.projectService.update(p).subscribe(res => {
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
            this.domain = project.domains[0].name
          }
        })
      }
    })
  }
}
