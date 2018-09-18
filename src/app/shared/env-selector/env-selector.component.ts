import { Location } from '@angular/common'
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd'

import { calcDrawerWidth } from '../../util/drawer'

@Component({
  selector: 'app-env-selector',
  templateUrl: './env-selector.component.html'
})
export class EnvSelectorComponent {

  drawerWidth = calcDrawerWidth()
  drawerBodyStyle = {
    'padding': '0px'
  }
  envModelDrawerVisible = false
  envName = ''
  @Input() env = ''
  @Output() envChange = new EventEmitter<string>()
  @HostListener('window:resize')
  resize() {
    this.drawerWidth = calcDrawerWidth()
  }

  constructor(
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private el: ElementRef<HTMLDivElement>,
  ) { }

  modelChange() {
    this.envChange.emit(this.env)
  }

  viewEnv() {
    this.envModelDrawerVisible = true
  }

  selectEnv() {
  }
}
