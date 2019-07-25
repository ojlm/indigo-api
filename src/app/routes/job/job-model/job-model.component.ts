import { Location } from '@angular/common'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18nKey } from '@core/i18n/i18n.message'
import { I18NService } from '@core/i18n/i18n.service'
import { formatImportsToSave } from '@shared/variables-import-table/variables-import-table.component'
import { ConfigService } from 'app/api/service/config.service'
import { FavoriteService } from 'app/api/service/favorite.service'
import { calcDrawerWidth } from 'app/util/drawer'
import {
  NzDrawerService,
  NzDropdownContextComponent,
  NzDropdownService,
  NzMenuItemDirective,
  NzMessageService,
} from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import { JobService, NewJob } from '../../../api/service/job.service'
import { ActorEvent, ActorEventType } from '../../../model/api.model'
import {
  ContextOptions,
  Favorite,
  FavoriteTargetType,
  FavoriteType,
  JobExecDesc,
  JobNotify,
  ScenarioStep,
  TransformFunction,
  VariablesImportItem,
} from '../../../model/es.model'
import { JobDataExt, JobMeta, TriggerMeta } from '../../../model/job.model'
import { PageSingleModel } from '../../../model/page.model'
import { JobRuntimeComponent } from '../job-runtime/job-runtime.component'

@Component({
  selector: 'app-job-model',
  templateUrl: './job-model.component.html',
  styleUrls: ['./job-model.component.css']
})
export class JobModelComponent extends PageSingleModel implements OnInit {

  tabIndex = 1
  caseSelectorSwitch = false
  jobSubscribersSwitch = false
  card1BodyStyle = {
    'padding': '12px',
    'background-color': 'white'
  }
  card2BodyStyle = {
    'padding': '12px',
    'background-color': 'snow'
  }
  jobId: string
  group: string
  project: string
  submitting = false
  jobMeta: JobMeta = {}
  triggerMeta: TriggerMeta = {}
  jobCaseIds: string[] = []
  jobDataExt: JobDataExt = undefined
  scenarioSteps: ScenarioStep[] = []
  testWs: WebSocket
  logSubject = new Subject<ActorEvent<JobExecDesc>>()
  consoleDrawerVisible = false
  subscribers: JobNotify[] = []
  ctxOptions: ContextOptions = {}
  reportId = ''
  imports: VariablesImportItem[] = []
  transforms: TransformFunction[] = []
  toptopChecked = false
  toptopId = ''
  runTimes = 1
  runtimeInit = {}
  runtimeContextSubject = new Subject<{}>()
  private dropdown: NzDropdownContextComponent
  constructor(
    private configService: ConfigService,
    private jobService: JobService,
    private favoriteService: FavoriteService,
    private msgService: NzMessageService,
    private nzDropdownService: NzDropdownService,
    private drawerService: NzDrawerService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
  ) {
    super()
  }

  test() {
    const times = parseInt(this.runTimes.toString(), 10)
    if (times > 10) {
      this.msgService.error('Times can not be bigger than 10')
      return
    }
    this.consoleDrawerVisible = true
    if (this.testWs) {
      this.testWs.close()
      this.testWs = null
    }
    this.testWs = this.jobService.newTestWs(this.group, this.project, this.jobId)
    this.testWs.onopen = (event) => {
      const testMessage = this.validateAndBuildNewJob(true)
      this.testWs.send(JSON.stringify({ ...testMessage, jobId: this.jobId, debug: { times: times } }))
      this.openRuntimeDrawer()
    }
    this.testWs.onmessage = (event) => {
      if (event.data) {
        try {
          const res = JSON.parse(event.data) as ActorEvent<JobExecDesc>
          if (ActorEventType.ITEM === res.type) {
            if (res.data && res.data['result'] && res.data['result']['context']) {
              this.runtimeInit = res.data['result']['context']
              this.runtimeContextSubject.next(this.runtimeInit)
            }
          } else if (ActorEventType.OVER === res.type) {
            if (res.data && res.data['context']) {
              this.runtimeInit = res.data['context']
              this.runtimeContextSubject.next(this.runtimeInit)
            }
          } else {
            this.logSubject.next(res)
          }
        } catch (error) {
          this.msgService.error(error)
          this.testWs.close()
        }
      }
    }
  }

  openRuntimeDrawer() {
    this.drawerService.create({
      nzWidth: calcDrawerWidth(0.4),
      nzContent: JobRuntimeComponent,
      nzContentParams: {
        init: this.runtimeInit,
        subject: this.runtimeContextSubject,
      },
      nzBodyStyle: {
        padding: '0px'
      },
      nzClosable: false,
    })
  }

  submit() {
    const newJob = this.validateAndBuildNewJob(false)
    if (newJob) {
      this.submitting = true
      if (this.jobId) {
        newJob.notifies = undefined
        this.jobService.update(this.jobId, newJob).subscribe(res => {
          this.submitting = false
          this.msgService.success(this.i18nService.fanyi(I18nKey.MsgSuccess))
        }, err => this.submitting = false)
      } else {
        this.jobService.index(newJob).subscribe(res => {
          this.submitting = false
          this.jobId = res.data.id
          this.router.navigateByUrl(`/job/${this.group}/${this.project}/${this.jobId}`)
        }, err => this.submitting = false)
      }
    }
  }

  toptopChange(checked: boolean) {
    if (!this.jobMeta.summary && checked) {
      this.msgService.error(this.i18nService.fanyi(I18nKey.ErrorEmptySummary))
      return
    } else {
      if (checked) {
        this.favoriteService
          .checkToptop(this.buildFavoriteDoc(checked))
          .subscribe(res => this.toptopId = res.data, _ => this.toptopChecked = false)
      } else {
        if (this.toptopId) {
          this.favoriteService
            .uncheckToptop(this.group, this.project, this.toptopId)
            .subscribe(_ => { }, _ => this.toptopChecked = true)
        }
      }
    }
  }

  buildFavoriteDoc(checked: boolean) {
    const doc: Favorite = {
      group: this.group,
      project: this.project,
      summary: this.jobMeta.summary,
      type: FavoriteType.TYPE_TOP_TOP,
      targetType: FavoriteTargetType.TARGET_TYPE_JOB,
      targetId: this.jobId,
      checked: checked,
    }
    return doc
  }

  envChange() {
    this.ctxOptions.jobEnv = this.jobMeta.env
  }

  tabIndexChange(index: number) {
    if (0 === index) {
      this.caseSelectorSwitch = true
    } else if (3 === index) {
      this.jobSubscribersSwitch = true
    }
  }

  reset() {
    this.jobCaseIds = []
    this.jobDataExt = undefined
    this.scenarioSteps = []
    this.jobMeta = {
      group: this.group,
      project: this.project,
      summary: '',
      description: ''
    }
    this.triggerMeta = {
      group: this.group,
      project: this.project
    }
  }

  validateAndBuildNewJob(isTest: boolean) {
    const jobMeta = { ...this.jobMeta }
    const triggerMeta = { ...this.triggerMeta }
    if (!this.jobMeta.summary && !isTest) {
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorEmptySummary))
      return
    }
    if (!(this.jobMeta.group || this.triggerMeta.group) && !isTest) {
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorEmptyGroup))
      return
    }
    if (!(this.jobMeta.project || this.triggerMeta.project) && !isTest) {
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorEmptyProject))
      return
    }
    if (this.jobCaseIds.length < 1 && this.scenarioSteps.length < 1 && undefined === this.jobDataExt) {
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorEmptyCaseScenarioCount))
      return
    }
    const newJob: NewJob = {
      jobMeta: jobMeta,
      triggerMeta: triggerMeta,
      jobData: {
        cs: this.jobCaseIds.map(id => {
          return { id: id }
        }),
        scenario: this.scenarioSteps,
        ext: this.jobDataExt
      },
      notifies: this.subscribers,
      imports: formatImportsToSave(this.imports),
    }
    return newJob
  }

  goBack() {
    this.location.back()
  }

  goTopTop() {
    if (this.toptopId && this.group && this.project) {
      this.router.navigateByUrl(`/toptop/${this.group}/${this.project}/${this.toptopId}`)
    }
  }

  contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
    this.dropdown = this.nzDropdownService.create($event, template)
  }

  closeContextMenu(e: NzMenuItemDirective): void {
    this.dropdown.close()
  }

  getSseApi() {
    return `${location.protocol}//${this.getApiUrl()}`
  }

  getWsApi() {
    if (location.protocol.startsWith('https')) {
      return `wss://${this.getApiUrl()}`
    } else {
      return `ws://${this.getApiUrl()}`
    }
  }

  getApiUrl() {
    if (this.jobId) {
      return `${location.host}/api/ci/job/${this.jobId}`
    } else {
      return 'save first'
    }
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.jobMeta.group = this.group
      this.jobMeta.project = this.project
      this.triggerMeta.group = this.group
      this.triggerMeta.project = this.project
    })
    if (this.transforms && this.transforms.length === 0) {
      this.configService.getAllTransforms().subscribe(res => {
        this.transforms = res.data
      })
    }
    this.route.parent.params.subscribe(params => {
      const jobId = params['jobId']
      if (jobId) {
        this.jobId = jobId
        this.jobService.getById(jobId).subscribe(res => {
          const job = res.data
          this.imports = job.imports
          this.jobMeta.summary = job.summary
          this.jobMeta.description = job.description
          this.jobMeta.scheduler = job.scheduler
          this.jobMeta.env = job.env
          this.ctxOptions.jobEnv = this.jobMeta.env
          this.jobMeta.classAlias = job.classAlias
          if (job.trigger && job.trigger.length > 0) {
            this.triggerMeta = job.trigger[0]
          }
          if (job.jobData && job.jobData.cs) {
            this.jobCaseIds = job.jobData.cs.map(item => item.id)
          }
          if (job.jobData && job.jobData.scenario) {
            this.scenarioSteps = job.jobData.scenario || []
          }
          if (job.jobData && job.jobData.ext) {
            this.jobDataExt = job.jobData.ext
          }
          this.favoriteService.exist(this.buildFavoriteDoc(false)).subscribe(favRes => {
            this.toptopId = favRes.data._id
            if (this.toptopId && favRes.data.checked) this.toptopChecked = true
          })
        })
      }
    })
  }
}
