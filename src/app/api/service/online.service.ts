import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { DomainOnlineLog } from 'app/model/es.model'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ApiRes, DataBody, QueryPage } from '../../model/api.model'
import { API_ONLINE } from '../path'
import { AggsItem, AggsQuery, BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class OnlineService extends BaseService {

  constructor(private http: _HttpClient) { super() }

  queryDomain(query: QueryDomain) {
    return this.http.post<ApiRes<QueryDomainResponse>>(`${API_ONLINE}/domain`, query)
  }

  aggDomainTerms(query: AggsQuery) {
    return this.http.post<ApiRes<AggsItem[]>>(`${API_ONLINE}/domain/aggs/terms`, query)
  }

  aggDomainTermsSubject(response: Subject<ApiRes<AggsItem[]>>) {
    const querySubject = new Subject<AggsQuery>()
    querySubject.pipe(debounceTime(this.DEFAULT_DEBOUNCE_TIME)).subscribe(query => {
      this.http.post<ApiRes<AggsItem[]>>(`${API_ONLINE}/domain/aggs/terms`, query).subscribe(
        res => response.next(res),
        err => response.error(err))
    })
    return querySubject
  }
}

export interface QueryDomain extends QueryPage {
  names?: string[]
  date?: string
}

export interface QueryDomainResponse {
  dates?: AggsItem[]
  domains?: DataBody<DomainOnlineLog[]>
}
