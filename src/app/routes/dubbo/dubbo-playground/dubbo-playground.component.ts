import { Location } from '@angular/common'
import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { I18NService } from '@core/i18n/i18n.service'
import { DubboInterface, DubboService, GetInterfacesMessage } from 'app/api/service/dubbo.service'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-dubbo-playground',
  templateUrl: './dubbo-playground.component.html',
  styles: [`
    .col-panel {
      height: 100%;
      border: 1px solid lightgray;
      border-radius: 8px;
      padding: 10px;
    }
  `]
})
export class DubboPlaygroundComponent implements OnInit {

  interfacesMsg: GetInterfacesMessage = {}
  interfaceList: DubboInterface[] = []
  height = `${window.innerHeight - 70}px`
  tableScroll = { y: `${window.innerHeight - 128}px` }
  @HostListener('window:resize')
  resize() {
    this.height = `${window.innerHeight - 70}px`
    this.tableScroll = { y: `${window.innerHeight - 128}px` }
  }

  constructor(
    private dubboService: DubboService,
    private msgService: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private i18nService: I18NService,
  ) { }

  getInterfaces() {
    this.dubboService.getInterfaces(this.interfacesMsg).subscribe(res => {
      this.interfaceList = res.data
    })
  }

  getProviders(item: DubboInterface) {
    this.dubboService.getProviders({ ...item }).subscribe(res => {

    })
  }

  test() {
  }

  ngOnInit(): void {
  }
}
