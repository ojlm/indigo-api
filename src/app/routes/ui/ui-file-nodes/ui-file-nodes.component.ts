import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { I18NService } from '@core'
import { FileNodeService, NewResponse, QueryFile } from 'app/api/service/file.node.service'
import { PageSingleModel } from 'app/model/page.model'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { UiConfigService } from '../ui-config.service'
import { UiFolderDialogComponent } from '../ui-folder-dialog/ui-folder-dialog.component'
import { UiMonkeyDialogComponent } from '../ui-monkey-dialog/ui-monkey-dialog.component'
import { UiUploadDialogComponent } from '../ui-upload-dialog/ui-upload-dialog.component'
import { APP, FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-file-nodes',
  templateUrl: './ui-file-nodes.component.html',
  styleUrls: ['../ui.module.css', './ui-file-nodes.component.css']
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
      return this.fileNodeService.getImgSrc(item)
    }
  }

  goFile(item: FileNode) {
    this.uiConfigService.menuCollapsedSubject.next(true)
    this.uiConfigService.goFile(item.group, item.project, item._id)
  }

  uploadKarate() {
    this.openUploadDialog('title.upload.karate', APP.KARATE)
  }

  uploadSoloPi() {
    this.openUploadDialog('title.upload.solopi', APP.SOLOPI)
  }

  openUploadDialog(titleKey: string, app: string) {
    this.modalService.create({
      nzTitle: this.i18nService.fanyi(titleKey),
      nzCancelText: null,
      nzOkText: null,
      nzFooter: null,
      nzWidth: window.innerWidth * 0.5,
      nzContent: UiUploadDialogComponent,
      nzComponentParams: {
        group: this.group,
        project: this.project,
        current: this.current,
        app: app,
      },
    }).afterClose.subscribe((_: any) => {
      this.load()
    })
  }

  newMonkey() {
    this.openNewFileDialog('title.monkey.new', UiMonkeyDialogComponent)
  }

  newFolder() {
    this.openNewFileDialog('title.folder.new', UiFolderDialogComponent)
  }

  openNewFileDialog(titleKey: string, content: any) {
    this.modalService.create({
      nzTitle: this.i18nService.fanyi(titleKey),
      nzCancelText: null,
      nzOkText: null,
      nzFooter: null,
      nzWidth: window.innerWidth * 0.6,
      nzContent: content,
      nzComponentParams: {
        group: this.group,
        project: this.project,
        current: this.current,
      },
    }).afterClose.subscribe((res: NewResponse) => {
      if (res && res.id) {
        this.uiConfigService.goFile(this.group, this.project, res.id)
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
