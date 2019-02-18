import { Inject, Injectable } from '@angular/core'
import { I18NService } from '@core/i18n/i18n.service'
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth'
import { _HttpClient } from '@delon/theme'
import { ApiRes } from 'app/model/api.model'
import { NzMessageService } from 'ng-zorro-antd'

import { API_CLUSTER } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class ClusterService extends BaseService {

  constructor(
    private http: _HttpClient,
    private msgService: NzMessageService,
    private i18nService: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
  ) { super() }

  getMembers() {
    return this.http.get<ApiRes<MemberInfo[]>>(`${API_CLUSTER}/members`)
  }
}

export interface MemberInfo {
  roles?: string[]
  address?: string
  protocol?: string
  port?: number
  status?: string
}
