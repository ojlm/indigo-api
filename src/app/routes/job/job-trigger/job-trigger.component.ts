import { Location } from '@angular/common'
import { Component, ElementRef, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { JobService } from '../../../api/service/job.service'
import { TriggerMeta, TriggerType } from '../../../model/job.model'

@Component({
  selector: 'app-job-trigger',
  templateUrl: './job-trigger.component.html',
  styles: []
})
export class JobTriggerComponent implements OnInit {

  trigger: TriggerMeta = {}
  tabBarStyle = {
    'padding': '0px'
  }
  tabIndex = 0
  lastIndexBeforeApi: number = null
  startDate
  endDate
  cronDates = []
  cronErrorMsg = ''
  repeatForever: boolean
  @Input() group = ''
  @Input() project = ''
  @Input()
  set data(val: TriggerMeta) {
    this.trigger = val
    switch (this.trigger.triggerType) {
      case TriggerType.MANUAL:
        this.tabIndex = 0
        break
      case TriggerType.SIMPLE:
        this.tabIndex = 1
        break
      case TriggerType.CRON:
        this.tabIndex = 2
        break
    }
    if (this.trigger.startDate) {
      try {
        this.startDate = new Date(this.trigger.startDate)
        this.trigger.startDate = this.startDate.getTime()
      } catch (error) { console.error(error) }
    }
    if (this.trigger.endDate) {
      try {
        this.endDate = new Date(this.trigger.endDate)
        this.trigger.endDate = this.endDate.getTime()
      } catch (error) { console.error(error) }
    }
    if (this.trigger.repeatCount === -1) {
      this.repeatForever = true
    }
  }
  get data() {
    return this.trigger
  }

  constructor(
    private msgService: NzMessageService,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private el: ElementRef<HTMLDivElement>,
  ) { }

  isStartNow(value: boolean) {
    if (value) {
      this.trigger.startDate = undefined
    }
  }

  startDateChange(startDate: Date) {
    this.trigger.startNow = false
    if (startDate) {
      this.trigger.startDate = startDate.getTime()
    } else {
      this.trigger.startDate = undefined
    }
  }

  endDateChange(endDate: Date) {
    if (endDate) {
      this.trigger.endDate = endDate.getTime()
    } else {
      this.trigger.endDate = undefined
    }
  }

  isRepeatForever(value: boolean) {
    if (value) {
      this.trigger.repeatCount = -1
    }
  }

  cronInputChange() {
    this.cronDates = []
    this.cronErrorMsg = ''
  }

  checkCron() {
    this.jobService.checkCron(this.group, this.project, this.trigger.cron).subscribe(res => {
      if (res.data && res.data.length > 0) {
        this.cronDates = res.data
        this.cronErrorMsg = ''
      } else {
        this.cronDates = []
        this.cronErrorMsg = `${res.msg}💩`
      }
    })
  }

  tabChange() {
    switch (this.tabIndex) {
      case 0:
        this.lastIndexBeforeApi = this.tabIndex
        this.trigger.triggerType = TriggerType.MANUAL
        break
      case 1:
        this.lastIndexBeforeApi = this.tabIndex
        this.trigger.triggerType = TriggerType.SIMPLE
        break
      case 2:
        this.lastIndexBeforeApi = this.tabIndex
        this.trigger.triggerType = TriggerType.CRON
        break
      case 3:
        break
    }
  }

  mouseleave() {
    if (null !== this.lastIndexBeforeApi && 3 === this.tabIndex) {
      this.tabIndex = this.lastIndexBeforeApi
      this.lastIndexBeforeApi = null
    }
    if (2 === this.tabIndex && 0 === this.cronDates.length && !this.cronErrorMsg) {
      this.checkCron()
    }
  }

  ngOnInit(): void {
  }
}
