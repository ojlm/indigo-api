import { Component, Input, OnInit } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { MonacoService } from '@core/config/monaco.service'
import { ScenarioStepType } from 'app/api/service/scenario.service'

import { JobService } from '../../../api/service/job.service'
import {
  CaseDataItemRequest,
  CaseReportItem,
  CaseReportItemMetrics,
  CaseResultResponse,
  JobReportDataItem,
  KeyValueObject,
} from '../../../model/es.model'
import { PageSingleModel } from '../../../model/page.model'
import { formatJson } from '../../../util/json'

@Component({
  selector: 'app-job-report-item',
  templateUrl: './job-report-item.component.html',
  styles: [`
    .metrics-item:not(:first-child) {
      padding-left: 10px;
    }
    .metrics-item .metrics-item-label {
      font-size: small;
      color: darkgray;
    }
    .metrics-item .metrics-item-value {
      font-size: small;
      color: lightseagreen;
    }
    .divider-text {
      font-size: small;
      color: gray;
    }
    .label-text {
      color: #59595d;
    }
    .label-value {
      padding-left: 8px;
    }
  `]
})
export class JobReportItemComponent extends PageSingleModel implements OnInit {

  item: CaseReportItem = {}
  itemData: JobReportDataItem = {}
  metrics: CaseReportItemMetrics = {}
  request: CaseDataItemRequest = { headers: {}, body: '' }
  requestHeaders: KeyValueObject[] = []
  responseHeaders: KeyValueObject[] = []
  response: CaseResultResponse = { headers: {}, body: '' }
  @Input() group = ''
  @Input() project = ''
  @Input() day = ''
  @Input()
  set data(item: CaseReportItem) {
    this.item = item
  }
  jsonEditorOption = this.monocoService.getJsonOption(true)
  requestBodyEditorOption = this.monocoService.getJsonOption(true)
  responseBodyEditorOption = this.monocoService.getJsonOption(true)
  entityEmbed = false
  entityBlobUrl: SafeUrl

  constructor(
    private jobService: JobService,
    private monocoService: MonacoService,
    private sanitizer: DomSanitizer,
  ) {
    super()
  }

  isHttp() {
    if (this.item.type === ScenarioStepType.DUBBO || this.item.type === ScenarioStepType.SQL) {
      return false
    } else {
      return true
    }
  }

  ngOnInit(): void {
    if (this.day && this.item.itemId) {
      this.jobService.getReportItemById(this.group, this.project, this.day, this.item.itemId).subscribe(res => {
        this.itemData = res.data
        this.metrics = this.itemData.metrics
        this.request = this.itemData.request as CaseDataItemRequest
        this.response = this.itemData.response
        if (this.isHttp()) {
          try {
            if (this.request.body) {
              const obj = JSON.parse(this.request.body)
              this.request.body = JSON.stringify(obj, null, '  ')
            }
          } catch (error) {
            this.requestBodyEditorOption = this.monocoService.getHtmlOption(true)
          }
          // handle response
          try {
            if (this.response.contentType.startsWith('image/') || this.response.contentType.startsWith('application/pdf')) {
              const b = atob(this.response.body)
              const buffer = new ArrayBuffer(b.length)
              const array = new Uint8Array(buffer)
              for (let i = 0; i < b.length; ++i) {
                array[i] = b.charCodeAt(i)
              }
              const blob = new Blob([array], { type: this.response.contentType })
              this.entityBlobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob))
              this.entityEmbed = true
            } else if (this.response.contentType.startsWith('application/javascript')) {
              this.responseBodyEditorOption = this.monocoService.getJavascriptOption(true)
              this.entityEmbed = false
            } else if (this.response.contentType.startsWith('text/html')) {
              this.responseBodyEditorOption = this.monocoService.getHtmlOption(true)
              this.entityEmbed = false
            } else {
              // application/json
              if (typeof this.response.body === 'string') {
                this.response.body = JSON.stringify(JSON.parse(this.response.body), null, '    ')
              } else {
                this.response.body = JSON.stringify(this.response.body, null, '    ')
              }
              this.entityEmbed = false
            }
          } catch (error) {
            this.responseBodyEditorOption = this.monocoService.getHtmlOption(true)
            this.entityEmbed = false
          }
          for (const k of Object.keys(this.request.headers)) {
            this.requestHeaders.push({ key: k, value: this.request.headers[k] })
          }
          for (const k of Object.keys(this.response.headers)) {
            this.responseHeaders.push({ key: k, value: this.response.headers[k] })
          }
        } else {
          this.request = {
            body: formatJson(this.request, 2)
          }
          this.response = {
            body: formatJson(this.response.body, 2)
          }
        }
        this.itemData.assertions = formatJson(this.itemData.assertions, 2)
        this.itemData.assertionsResult = formatJson(this.itemData.assertionsResult, 2)
      })
    }
  }
}
