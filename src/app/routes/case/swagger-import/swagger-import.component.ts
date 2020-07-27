import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { I18NService } from '@core'
import { OpenApiService } from '@core/config/openapi.service'
import { I18nKey } from '@core/i18n/i18n.message'
import { CaseService, ConvertOptions } from 'app/api/service/case.service'
import { Case } from 'app/model/es.model'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: 'app-swagger-import',
  templateUrl: './swagger-import.component.html',
  styleUrls: ['./swagger-import.component.css']
})
export class SwaggerImportComponent implements OnInit {

  group = ''
  project = ''

  isLoading = false
  isImporting = false

  swaggerUrl = ''
  swaggerContent = ''
  options: ConvertOptions = { labels: [...this.openApiService.defaultImportLabels] }
  list: Case[] = []

  constructor(
    private caseService: CaseService,
    private msgService: NzMessageService,
    private openApiService: OpenApiService,
    private i18nService: I18NService,
    private route: ActivatedRoute,
  ) { }

  preview() {
    this.isLoading = true
    this.caseService.openApiPreview(this.group, this.project,
      { url: this.swaggerUrl, content: this.swaggerContent, options: this.options }
    ).subscribe(res => {
      this.list = res.data
      this.isLoading = false
    }, _ => this.isLoading = false)
  }

  remove(i: number) {
    this.list.splice(i, 1)
    this.list = [...this.list]
  }

  import() {
    this.isImporting = true
    this.caseService.openApiImport(this.group, this.project, { list: this.list }).subscribe(res => {
      this.isImporting = false
      this.msgService.warning(this.i18nService.fanyi(I18nKey.MsgSuccess))
    }, _ => this.isImporting = false)
  }

  methodTagColor(item: Case) {
    switch (item.request.method) {
      case 'GET':
        return 'green'
      case 'DELETE':
        return 'red'
      case 'POST':
        return 'cyan'
      case 'PUT':
        return 'blue'
      default:
        return 'purple'
    }
  }

  ngOnInit(): void {
    if (this.route.parent && this.route.parent.parent) {
      this.route.parent.parent.params.subscribe(params => {
        this.group = params['group']
        this.project = params['project']
      })
    }
  }
}
