import { Location } from '@angular/common'
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { EnvService } from '../../api/service/env.service'
import { Environment } from '../../model/es.model'
import { PageSingleModel } from '../../model/page.model'
import { calcDrawerWidth } from '../../util/drawer'

@Component({
  selector: 'app-env-selector',
  templateUrl: './env-selector.component.html'
})
export class EnvSelectorComponent extends PageSingleModel implements OnInit {

  group: string
  project: string
  items: Environment[] = []
  loading = false
  drawerWidth = calcDrawerWidth()
  drawerBodyStyle = {
    'padding': '0px'
  }
  envModelDrawerVisible = false
  envSelectorDrawerVisible = false
  envName = ''
  @Input() env = ''
  @Output() envChange = new EventEmitter<string>()
  @HostListener('window:resize')
  resize() {
    this.drawerWidth = calcDrawerWidth()
  }

  constructor(
    private msgService: NzMessageService,
    private envService: EnvService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private el: ElementRef<HTMLDivElement>,
  ) { super() }

  modelChange() {
    this.envChange.emit(this.env)
  }

  viewEnv() {
    this.envModelDrawerVisible = true
  }

  selectEnv() {
    this.envSelectorDrawerVisible = true
    if (this.items.length === 0) {
      this.loadEnvs()
    }
  }

  clickItem(item: Environment) {
    this.env = item._id
    this.envName = item.summary
    this.envChange.emit(this.env)
    this.envSelectorDrawerVisible = false
    this.envModelDrawerVisible = true
  }

  loadEnvs() {
    if (this.group && this.project) {
      this.loading = true
      this.envService.query({ group: this.group, project: this.project, ...this.toPageQuery() }).subscribe(res => {
        this.items = res.data.list
        this.pageTotal = res.data.total
        this.loading = false
      }, err => this.loading = false)
    }
  }

  pageChange() {
    this.loadEnvs()
  }

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(params => {
      this.group = params['group']
      this.project = params['project']
    })
  }
}
