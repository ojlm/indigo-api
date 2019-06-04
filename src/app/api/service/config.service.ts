import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'

import { ApiRes } from '../../model/api.model'
import { Assertion, TransformFunction } from '../../model/es.model'
import { API_CONFIG } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class ConfigService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  getBasics() {
    return this.http.get<ApiRes<BasicConfig>>(`${API_CONFIG}/basics`)
  }

  getAllAssertions() {
    return this.http.get<ApiRes<Assertion[]>>(`${API_CONFIG}/assertions`)
  }

  getAllTransforms() {
    return this.http.get<ApiRes<TransformFunction[]>>(`${API_CONFIG}/transforms`)
  }
}

export interface BasicConfig {
  assertions: Assertion[]
  transforms: TransformFunction[]
}
