import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { I18NService } from '@core'
import { FileNodeService, NewResponse, QueryFile } from 'app/api/service/file.node.service'
import { PageSingleModel } from 'app/model/page.model'
import { NzFormatEmitEvent, NzMessageService, NzModalService, NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd'

import { UiConfigService } from '../ui-config.service'
import { UiFolderDialogComponent } from '../ui-folder-dialog/ui-folder-dialog.component'
import { UiMonkeyDialogComponent } from '../ui-monkey-dialog/ui-monkey-dialog.component'
import { APP, FileNode } from '../ui.model'

@Component({
  selector: 'app-ui-file-tree',
  templateUrl: './ui-file-tree.component.html',
  styleUrls: ['./ui-file-tree.component.css']
})
export class UiFileTreeComponent extends PageSingleModel implements OnInit, OnDestroy {

  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent

  group = ''
  project = ''
  id = ''

  // TODO page
  pageSize = 2000
  q: QueryFile = {
    topOnly: false
  }
  nodes: NzTreeNodeOptions[] = []

  expandedKeys: string[] = []
  selectedKeys: string[] = []

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

  getImgSrc(node: NzTreeNodeOptions, item: FileNode) {
    if (item.type === 'folder') {
      if (node.isExpanded) {
        return '/assets/svg/folder-open.svg'
      } else {
        return '/assets/svg/folder.svg'
      }
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

  clickNode(event: NzFormatEmitEvent) {
    const node = event.node
    const item = node.origin.file
    if (!node.isLeaf) {
      node.isExpanded = !node.isExpanded
    }
    this.uiConfigService.goFile(item.group, item.project, item._id)
  }

  uploadKarate() {
    this.msgService.warning('TBD')
  }

  uploadSoloPi() {
    this.msgService.warning('TBD')
  }

  newMonkey(node: NzTreeNodeOptions) {
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
        current: node ? node.origin.file : null,
      },
    }).afterClose.subscribe((res: NewResponse) => {
      this.dealNewFile(res)
    })
  }

  newFolder(node: NzTreeNodeOptions) {
    this.modalService.create({
      nzTitle: this.i18nService.fanyi('title.folder.new'),
      nzCancelText: null,
      nzOkText: null,
      nzFooter: null,
      nzContent: UiFolderDialogComponent,
      nzComponentParams: {
        group: this.group,
        project: this.project,
        current: node ? node.origin.file : null,
      },
    }).afterClose.subscribe((res: NewResponse) => {
      this.dealNewFile(res)
    })
  }

  dealNewFile(res: NewResponse) {
    if (res.id) {
      res.doc._id = res.id
      this.id = res.id
      this.uiConfigService.goFile(this.group, this.project, res.id)
      this.load()
    }
  }

  mv(node: NzTreeNodeOptions) {
    console.log('mv', node)
    this.msgService.warning('TBD')
  }

  delete(node: NzTreeNodeOptions) {
    console.log('delete', node)
    this.msgService.warning('TBD')
  }

  reset() {
    this.nodes = []
    this.pageIndex = 1
  }

  load() {
    this.fileNodeService.query(this.q.group, this.q.project, { ...this.q, ...this.toPageQuery() }).subscribe(res => {
      this.pageTotal = res.data.total
      this.toTreeNodes(res.data.list)
    })
  }

  toTreeNode(file: FileNode) {
    const node: NzTreeNodeOptions = {
      title: file.name,
      key: file._id,
      isLeaf: file.type === 'file',
      file: file,
    }
    return node
  }

  toTreeNodes(files: FileNode[]) {
    const nodesMap: { [k: string]: NzTreeNodeOptions } = {}
    const parentNodeOptionsMap: { [k: string]: NzTreeNodeOptions[] } = {}
    const root: NzTreeNodeOptions[] = []
    // 1. make children 2. build parent -(;
    files.forEach(file => {
      const node: NzTreeNodeOptions = this.toTreeNode(file)
      nodesMap[node.key] = node
      if (file.parent) {
        const children = parentNodeOptionsMap[file.parent]
        if (children) {
          children.push(node)
        } else {
          parentNodeOptionsMap[file.parent] = [node]
        }
      }
    })
    if (this.id) {
      const selected = nodesMap[this.id]
      this.selectedKeys = [this.id]
      if (selected.file.path) {
        this.expandedKeys = selected.file.path.map(path => path.id)
      }
    }
    files.forEach(file => {
      const children = parentNodeOptionsMap[file._id]
      if (children) {
        nodesMap[file._id].children = children
      }
      if (!file.parent) {
        root.push(nodesMap[file._id])
      }
    })
    this.nodes = root
    this.selectedKeys = [...this.selectedKeys]
    this.expandedKeys = [...this.expandedKeys]
  }

  ngOnInit(): void {
    if (this.route.children[0] && this.route.children[0].snapshot) {
      const params = this.route.snapshot.params
      const childParams = this.route.children[0].snapshot.params
      if (childParams['fileId']) {
        this.group = params['group']
        this.project = params['project']
        this.id = childParams['fileId']
        this.q.group = this.group
        this.q.project = this.project
        this.load()
      }
    }
  }

  ngOnDestroy(): void {
  }

}
