import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { I18NService } from '@core'
import { FileNodeService, QueryFile } from 'app/api/service/file.node.service'
import { PageSingleModel } from 'app/model/page.model'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { UiConfigService } from '../ui-config.service'
import { UiFolderDialogComponent } from '../ui-folder-dialog/ui-folder-dialog.component'
import { UiMonkeyDialogComponent } from '../ui-monkey-dialog/ui-monkey-dialog.component'
import { APP, FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-file-nodes',
  templateUrl: './ui-file-nodes.component.html',
  styleUrls: ['./ui-file-nodes.component.css']
})
export class UiFileNodesComponent extends PageSingleModel implements OnInit, OnDestroy {

  group = ''
  project = ''

  // TODO page
  pageSize = 2000
  q: QueryFile = {
    topOnly: true
  }
  files: FileNode[] = []
  current: FileNode

  constructor(
    private uiConfigService: UiConfigService,
    private fileNodeService: FileNodeService,
    private msgService: NzMessageService,
    private modalService: NzModalService,
    private i18nService: I18NService,
    private route: ActivatedRoute,
  ) {
    super()
  }

  getImgSrc(item: FileNode) {
    if (item.type === 'folder') {
      return '/assets/svg/folder.svg'
    } else {
      switch (item.app) {
        case APP.KARATE:
          return '/assets/svg/karate.svg'
        case APP.SOLOPI:
          return '/assets/svg/pi.svg'
        case APP.WEB_MONKEY:
          return '/assets/svg/monkey.svg'
        default:
          return '/assets/svg/file.svg'
      }
    }
  }

  goFile(item: FileNode) {
    this.uiConfigService.goFile(item.group, item.project, item._id)
  }

  uploadKarate() {
    this.msgService.warning('TBD')
  }

  uploadSoloPi() {
    this.msgService.warning('TBD')
  }

  newMonkey() {
    this.modalService.create({
      nzTitle: this.i18nService.fanyi('title.monkey.new'),
      nzCancelText: null,
      nzOkText: null,
      nzFooter: null,
      nzWidth: window.innerWidth * 0.6,
      nzContent: UiMonkeyDialogComponent,
      nzComponentParams: {
        group: this.group,
        project: this.project,
        current: this.current,
      },
    }).afterClose.subscribe(newFileId => {
      if (newFileId) {
        this.uiConfigService.goFile(this.group, this.project, newFileId)
      }
    })
  }

  newFolder() {
    this.modalService.create({
      nzTitle: this.i18nService.fanyi('title.folder.new'),
      nzCancelText: null,
      nzOkText: null,
      nzFooter: null,
      nzContent: UiFolderDialogComponent,
      nzComponentParams: {
        group: this.group,
        project: this.project,
        current: this.current,
      },
    }).afterClose.subscribe(newFileId => {
      if (newFileId) {
        this.uiConfigService.goFile(this.group, this.project, newFileId)
      }
    })
  }

  reset() {
    this.files = []
    this.pageIndex = 1
  }

  load() {
    this.fileNodeService.query(this.q.group, this.q.project, { ...this.q, ...this.toPageQuery() }).subscribe(res => {
      this.pageTotal = res.data.total
      this.files = res.data.list
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.q.group = this.group
      this.q.project = this.project
      this.load()
    })
  }

  ngOnDestroy(): void {
  }

}
