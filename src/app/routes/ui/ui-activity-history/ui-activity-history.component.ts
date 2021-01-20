import { Component, Input, OnInit } from '@angular/core'
import { UiService } from 'app/api/service/ui.service'
import { PageSingleModel } from 'app/model/page.model'

import { FileNode, UiTaskReport } from '../ui.model'

@Component({
  selector: 'app-ui-activity-history',
  templateUrl: './ui-activity-history.component.html',
  styleUrls: ['./ui-activity-history.component.css']
})
export class UiActivityHistoryComponent extends PageSingleModel implements OnInit {

  group = ''
  project = ''
  id = ''
  _file: FileNode
  items: UiTaskReport[] = []

  @Input()
  set file(val: FileNode) {
    this._file = val
    this.group = val.group
    this.project = val.project
    this.id = val._id
    if (this.group && this.project && this.id) {
      this.reload()
    }
  }

  constructor(
    private uiService: UiService,
  ) {
    super()
  }

  click(item: UiTaskReport) {
    const url = `/ui/report/${item.group}/${item.project}/${item._id}`
    window.open(url)
  }

  reload() {
    this.pageIndex = 1
    this.items = []
    this.load()
  }

  load() {
    this.uiService.queryTaskReport(this.group, this.project, { taskId: this.id, ...this.toPageQuery() }).subscribe(res => {
      this.pageTotal = res.data.total
      this.items = res.data.list
    })
  }

  ngOnInit(): void {
  }

}
