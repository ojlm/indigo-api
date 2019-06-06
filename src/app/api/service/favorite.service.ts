import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { Observable } from 'rxjs'

import { ApiRes, QueryPage } from '../../model/api.model'
import { Favorite, IndexDocResponse } from '../../model/es.model'
import { API_FAVORITE } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class FavoriteService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  exist(doc: Favorite) {
    return this.http.post<ApiRes<string>>(`${API_FAVORITE}/exist`, doc)
  }

  query(query: QueryFavorite) {
    return this.http.post<ApiRes<ToptopGroupResponse[]>>(`${API_FAVORITE}/query`, query)
  }

  index(doc: Favorite) {
    return this.http.put<ApiRes<IndexDocResponse>>(API_FAVORITE, doc)
  }

  delete(id: string) {
    return this.http.delete(`${API_FAVORITE}/${id}`) as Observable<ApiRes<any>>
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

export interface ExToptopGroupResponse extends ToptopGroupResponse {
  active?: boolean
}
