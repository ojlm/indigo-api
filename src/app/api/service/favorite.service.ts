import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'

import { ApiRes, QueryPage } from '../../model/api.model'
import { Favorite, Job, Scenario } from '../../model/es.model'
import { API_FAVORITE } from '../path'
import { AggsItem, BaseService } from './base.service'
import { ScenarioResponse } from './scenario.service'

@Injectable({
  providedIn: 'root'
})
export class FavoriteService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  exist(doc: Favorite) {
    return this.http.post<ApiRes<Favorite>>(`${API_FAVORITE}/exist`, doc)
  }

  query(query: QueryFavorite) {
    return this.http.post<ApiRes<ToptopGroupResponse[]>>(`${API_FAVORITE}/query`, query)
  }

  checkToptop(doc: Favorite) {
    return this.http.put<ApiRes<string>>(`${API_FAVORITE}/toptop/check`, doc)
  }

  uncheckToptop(group: string, project: string, id: string) {
    return this.http.get(`${API_FAVORITE}/toptop/uncheck/${group}/${project}/${id}`)
  }

  groupAggs() {
    return this.http.get<ApiRes<AggsItem[]>>(`${API_FAVORITE}/groups`)
  }

  getToptop(group: string, project: string, id: string) {
    return this.http.get<ApiRes<ToptopResponse>>(`${API_FAVORITE}/toptop/${group}/${project}/${id}`)
  }
}

export interface QueryFavorite extends QueryPage {
  group?: string
  project?: string
  type?: string
  user?: string
  targetType?: string
  targetId?: string
  text?: string
}

export interface ToptopGroupResponse {
  group?: string
  summary?: string
  items?: Favorite[]
}

export interface ExToptopGroupResponse extends AggsItem {
  active?: boolean
}

export interface ToptopResponse extends ScenarioResponse {
  job?: Job
  scenarios?: { [k: string]: Scenario }
  jobId?: string
}
