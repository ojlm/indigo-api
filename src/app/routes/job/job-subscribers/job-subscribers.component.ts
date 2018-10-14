import { Location } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { JobNotifyFunction, JobService } from 'app/api/service/job.service'
import { JobNotify } from 'app/model/es.model'
import { PageSingleModel } from 'app/model/page.model'
import { calcDrawerWidth } from 'app/util/drawer'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-job-subscribers',
  templateUrl: './job-subscribers.component.html',
  styles: []
})
export class JobSubscribersComponent extends PageSingleModel implements OnInit {

  pageSize = Number.MAX_SAFE_INTEGER
  drawerVisible = false
  drawerWidth = calcDrawerWidth()
  group: string
  project: string
  markdown = ''
  supports: JobNotifyFunction[] = []
  selected: JobNotifyFunction
  items: JobNotify[] = []
  editItem: JobNotify = {}
  _jobId: string
  @Input()
  set data(val: JobNotify[]) {
    if (val && val.length > 0) {
      this.items = val
    }
  }
  get data() {
    return this.items
  }
  @Output()
  dataChange = new EventEmitter<JobNotify[]>()

  constructor(
    private jobService: JobService,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) { super() }

  addNew() {
    this.drawerVisible = true
    this.editItem = {
      trigger: 'all',
      enabled: true,
    }
    if (this.supports.length > 0) {
      this.editItem.type = this.supports[0].type
    }
  }

  modelChange() {
    if (!this._jobId) {
      this.dataChange.emit(this.data)
    }
  }

  saveOrAdd() {
    if (this.selected.type && this.editItem) {
      const notify: JobNotify = {
        group: this.group,
        project: this.project,
        jobId: this._jobId,
        ...this.editItem
      }
      notify._id = undefined
      if (this.editItem._id) {
        this.jobService.updateSubscriber(this.editItem._id, notify).subscribe(res => {
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
        })
      } else {
        if (this._jobId) {
          this.jobService.newSubscriber(notify).subscribe(res => {
            this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
            this.search()
          })
        } else {
          this.items.push(notify)
          this.pageTotal = this.items.length
          this.items = [...this.items]
          this.modelChange()
        }
      }
    }
  }

  selectChange() {
    if (this.selected) {
      this.markdown = this.selected.description
      this.editItem.type = this.selected.type
      this.modelChange()
    }
  }

  edit(item: JobNotify) {
    this.drawerVisible = true
    this.editItem = item
  }

  delete(item: JobNotify, index: number) {
    if (item._id) {
      this.jobService.deleteSubscriber(item._id).subscribe(res => {
        this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
        this.search()
      })
    } else {
      this.items.splice(index, 1)
      this.items = [...this.items]
      this.pageTotal = this.items.length
      this.modelChange()
    }
  }

  triggerType(item: JobNotify) {
    switch (item.trigger) {
      case 'all':
        return this.i18nService.fanyi(I18nKey.ItemAlwaysSend)
      case 'pass':
        return this.i18nService.fanyi(I18nKey.ItemPassSend)
      case 'fail':
        return this.i18nService.fanyi(I18nKey.ItemFailSend)
      default:
        return item.type
    }
  }

  enableType(item: JobNotify) {
    if (item.enabled) {
      return this.i18nService.fanyi(I18nKey.ItemEnabled)
    } else {
      return this.i18nService.fanyi(I18nKey.ItemDisabled)
    }
  }

  search() {
    if (this._jobId) {
      this.jobService.querySubscribers({ jobId: this._jobId, ...this.toPageQuery() })
        .subscribe(res => {
          this.items = res.data.list
          this.pageTotal = res.data.total
        })
    }
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
    })
    this.route.parent.params.subscribe(params => {
      const jobId = params['jobId']
      if (jobId) {
        this._jobId = jobId
        this.pageSize = 10
        this.search()
      }
    })
    this.jobService.getAllNotifiers().subscribe(res => {
      this.supports = res.data
      if (this.supports.length > 0) {
        this.selected = this.supports[0]
        this.selectChange()
      }
    })
  }
}
