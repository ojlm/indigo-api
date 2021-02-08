import { Inject, Injectable } from '@angular/core'
import { I18NService } from '@core'
import { I18nKey } from '@core/i18n/i18n.message'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { CommandOptions, LogEntry, UiTaskReport } from 'app/routes/ui/ui.model'
import { newWS, newWSUrl } from 'app/util/ws'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, QueryPage } from '../../model/api.model'
import { API_UI, API_WS } from '../path'
import { BaseService } from './base.service'
import { SearchAfter } from './case.service'

@Injectable({
  providedIn: 'root'
})
export class UiService extends BaseService {

  constructor(
    private http: _HttpClient,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { super() }

  runSolopi(group: string, project: string, id: string, params: RunTaskInBlob) {
    return this.http.post<ApiRes<UiTaskReport[]>>(`${API_UI}/task/run/solopi/${group}/${project}/${id}`, params)
  }

  runCommand(group: string, project: string, id: string, params: DriverCommand) {
    return this.http.post<ApiRes<UiTaskReport[]>>(`${API_UI}/task/run/command/${group}/${project}/${id}`, params)
  }

  getReportLogsSubject(group: string, project: string, reportId: string, response: Subject<ApiRes<LogEntry[]>>) {
    const querySubject = new Subject<SearchAfterLogEntry>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<LogEntry[]>>(`${API_UI}/task/report/log/${group}/${project}/${reportId}`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }

  getTaskReport(group: string, project: string, id: string) {
    return this.http.get<ApiRes<UiTaskReport>>(`${API_UI}/task/report/${group}/${project}/${id}`)
  }

  queryTaskReport(group: string, project: string, q: QueryUiReport) {
    return this.http.post<ApiRes<UiTaskReport[]>>(`${API_UI}/task/report/${group}/${project}`, q)
  }

  getDriverLabel(driver: UiDriverInfo) {
    return `${driver.host}:${driver.port}`
  }

  getDriverList(group: string, project: string, driverType: string) {
    return this.http.get<ApiRes<UiDriverInfo[]>>(`${API_UI}/driver/list/${group}/${project}?driverType=${driverType}`)
  }

  // direct connect ip:port
  getRfbProxyUrl(driver: UiDriverInfo, group: string, project: string) {
    const query = `host=${driver.host}&port=${driver.port}&token=${this.tokenService.get().token}`
    return newWSUrl(`${API_WS}/ui/proxy/rfb/${group}/${project}?${query}`)
  }

  connectDriver(driver: UiDriverInfo, group: string, project: string, id: string) {
    const query = `host=${driver.host}&port=${driver.port}&token=${this.tokenService.get().token}`
    const ws = newWS(`${API_WS}/ui/proxy/connect/${group}/${project}/${id}?${query}`)
    ws.onerror = (event) => {
      console.error(event)
      this.msgService.warning(this.i18nService.fanyi(I18nKey.ErrorWsOnError))
    }
    return ws
  }

}

export interface UiDriverInfo {
  host?: string
  port?: number
  password?: string
  type?: string
  hostname?: string
  // mobile
  systemVersion?: string
  model?: string
  brand?: string
  manufacturer?: string
  product?: string
  sdkVersion?: number
  serial?: string
  screenSize?: string
  displaySize?: string
  densityDpi?: number
  density?: number
  cpuABI?: string
  mac?: string
  ram?: number
  screenCapture?: string
  timestamp?: number
  _checked?: boolean
}

export interface CommandMeta {
  group?: string
  project?: string
  taskId?: string
  creator?: string
  reportId?: string
  startAt?: number
  endAt?: number
  hostname?: string
  pid?: string
}

export interface DriverCommand {
  name?: string
  description?: string
  type?: string
  creator?: string
  params?: any
  meta?: CommandMeta
  servos?: ServoAddress[]
  options?: CommandOptions
}

export interface DriverStatus {
  startAt?: number
  updateAt?: string
  status?: string
  command?: DriverCommand
}

export interface DriverCommandStart {
  ok?: boolean
  msg?: string
  status?: DriverStatus
}

export interface DriverCommandResult {
  ok?: boolean
  msg?: string
  status?: DriverStatus
}

export interface AreaRatio {
  locator?: string
  ratio?: number
}

export interface MonkeyCommandParams {
  startUrl?: string
  delta?: number
  minOnceKeyCount?: number
  maxOnceKeyCount?: number
  cjkRatio?: number
  keyEventRatio?: number
  interval?: number
  generateCount?: number
  maxDuration?: number
  beforeScript?: string
  checkInterval?: number
  checkScript?: string
  areaRatio?: AreaRatio[]
}

export interface DriverCommandLog {
  command?: string
  type?: string
  params?: any
}

export interface KarateCommandParams {
  text?: string
}

export interface QueryUiReport extends QueryPage {
  group?: string
  project?: string
  type?: string
  taskId?: string
}

export interface SearchAfterLogEntry extends SearchAfter {
  day?: string
  reportId?: string
  levels?: string[]
  text?: string
}

export interface ServoAddress {
  host?: string
  port?: number
  hostname?: string
}

export interface RunTaskInBlob {
  key?: string
  servos?: ServoAddress[]
}
