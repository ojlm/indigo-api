import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core'
import { I18nKey } from '@core/i18n/i18n.message'
import { GroupProjectSelectorModel } from '@shared/group-project-selector/group-project-selector.component'
import { SortablejsOptions } from 'angular-sortablejs'
import { isJobScenarioStep } from 'app/api/service/job.service'
import { ScenarioModelComponent } from 'app/routes/scenario/scenario-model/scenario-model.component'
import { StepJumpComponent } from 'app/routes/scenario/step-jump/step-jump.component'
import { NzDrawerService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'

import {
  QueryScenario,
  ScenarioService,
  ScenarioStepType,
  scenarioToScenarioStep,
} from '../../../api/service/scenario.service'
import { ApiRes } from '../../../model/api.model'
import { ContextOptions, Scenario, ScenarioStep, TimeUnit } from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'
import { calcDrawerWidth } from '../../../util/drawer'

@Component({
  selector: 'app-scenario-selector',
  templateUrl: './scenario-selector.component.html',
  styleUrls: ['./scenario-selector.component.css'],
})
export class ScenarioSelectorComponent extends PageSingleModel implements OnInit {

  @Input() group: string
  @Input() project: string
  sortablejsOptions: SortablejsOptions = {
    handle: '.anticon-bars',
    onUpdate: function (event: any) {
      this.dataChange.emit(this.data)
    }.bind(this)
  }
  drawerWidth = calcDrawerWidth(0.75)
  pageSize = 10
  items: Scenario[] = []
  searchGroupProject: GroupProjectSelectorModel
  searchSubject: Subject<QueryScenario>
  searchText: string
  steps: ScenarioStep[] = []
  stepsMap: { [k: string]: boolean } = {}
  stepsScenarioMap: { [k: string]: Scenario } = {}

  @Input()
  set data(steps: ScenarioStep[]) {
    if (steps.length > 0 && this.steps.length === 0) {
      const ids = steps.filter(item => isJobScenarioStep(item)).map(item => item.id)
      this.scenarioService.query({ ids: ids }).subscribe(res => {
        res.data.list.forEach(item => {
          this.stepsMap[item._id] = true
          this.stepsScenarioMap[item._id] = item
        })
        this.steps = steps
        this.steps.filter(item => isJobScenarioStep(item)).forEach(item => this.stepsMap[item.id] = true)
      })
    } else if (steps.length === 0 && this.steps.length !== 0) {
      this.steps = []
      this.stepsMap = {}
      this.stepsScenarioMap = {}
    }
  }
  get data() {
    return this.steps
  }
  @Output() dataChange = new EventEmitter<ScenarioStep[]>()
  _ctxOptions: ContextOptions = {}
  @Input()
  set ctxOptions(val: ContextOptions) {
    if (val) {
      this._ctxOptions = val
    }
  }
  @HostListener('window:resize')
  resize() {
    this.drawerWidth = calcDrawerWidth(0.75)
  }

  constructor(
    private drawerService: NzDrawerService,
    private scenarioService: ScenarioService,
    private i18nService: I18NService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super()
    const response = new Subject<ApiRes<Scenario[]>>()
    response.subscribe(res => {
      this.pageTotal = res.data.total
      this.items = res.data.list
    })
    this.searchSubject = this.scenarioService.newQuerySubject(response)
  }

  addDelayStep() {
    const step: ScenarioStep = {
      type: ScenarioStepType.DELAY,
      stored: false,
      enabled: true,
      data: { delay: { value: 1, timeUnit: TimeUnit.SECOND } }
    }
    this.steps.push(step)
    this.steps = [...this.steps]
  }

  addJumpStep() {
    const step: ScenarioStep = {
      type: ScenarioStepType.JUMP,
      stored: false,
      enabled: true,
      data: { jump: { type: 0, script: '', conditions: [] } }
    }
    this.steps.push(step)
    this.steps = [...this.steps]
    this.openJumpModelDrawer(this.steps.length - 1, step)
  }

  openJumpModelDrawer(idx: number, step: ScenarioStep) {
    this.drawerService.create({
      nzWidth: this.drawerWidth,
      nzContent: StepJumpComponent,
      nzContentParams: {
        data: { index: idx, step: step },
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
  }

  addItem(item: Scenario) {
    this.steps.push(scenarioToScenarioStep(item))
    this.steps = [...this.steps]
    this.stepsMap[item._id] = true
    this.stepsScenarioMap[item._id] = item
    this.dataChange.emit(this.data)
  }

  removeItem(item: ScenarioStep, i: number) {
    const count = this.steps.filter(s => (s.type === item.type || !s.type) && s.id === item.id).length
    if (count < 2) delete this.stepsMap[item.id]
    this.steps.splice(i, 1)
    this.dataChange.emit(this.data)
  }

  viewScenario(item: ScenarioStep) {
    this.drawerService.create({
      nzWidth: this.drawerWidth,
      nzContent: ScenarioModelComponent,
      nzContentParams: {
        id: item.id,
        ctxOptions: this._ctxOptions
      },
      nzBodyStyle: {
        padding: '4px'
      },
      nzClosable: false,
    })
  }

  getStepTitle(step: ScenarioStep) {
    switch (step.type) {
      case ScenarioStepType.JUMP:
        return this.i18nService.fanyi(I18nKey.TipsJumpStep)
      case ScenarioStepType.DELAY:
        return this.i18nService.fanyi(I18nKey.TipsDelayStep)
      default:
        const s = this.stepsScenarioMap[step.id]
        return s ? s.summary : ''
    }
  }

  getGroupAndProject(step: ScenarioStep) {
    const s = this.stepsScenarioMap[step.id]
    return s ? `${s.group}/${s.project}` : ''
  }

  search() {
    this.searchSubject.next({ ...this.searchGroupProject, text: this.searchText, ...this.toPageQuery() })
  }

  goItem(item: Scenario) {
    this.router.navigateByUrl(`/scenario/${item.group}/${item.project}/${item._id}`)
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
      this.searchGroupProject = {
        group: this.group,
        project: this.project
      }
      this.searchSubject.next({ group: this.group, project: this.project })
    })
  }
}
