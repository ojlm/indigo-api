import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { IndexDocResponse } from 'app/model/es.model'
import { DocRef } from 'app/model/job.model'
import { FileNode } from 'app/routes/ui/ui.model'
import { Observable } from 'rxjs'

import { ApiRes, QueryPage } from '../../model/api.model'
import { API_FILES } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class FileNodeService extends BaseService {

  constructor(
    private http: _HttpClient,
  ) { super() }

  get(group: string, project: string, id: string) {
    return this.http.get<ApiRes<FileNode>>(`${API_FILES}/${group}/${project}/${id}`)
  }

  query(group: string, project: string, query: QueryFile) {
    return this.http.post<ApiRes<FileNode[]>>(`${API_FILES}/${group}/${project}/query`, query)
  }

  newFile(group: string, project: string, doc: NewFile) {
    return this.http.put(`${API_FILES}/${group}/${project}/file`, doc) as Observable<ApiRes<IndexDocResponse>>
  }

  newFolder(group: string, project: string, doc: NewFolder) {
    return this.http.put(`${API_FILES}/${group}/${project}/folder`, doc) as Observable<ApiRes<IndexDocResponse>>
  }

}

export interface QueryFile extends QueryPage {
  group?: string
  project?: string
  type?: string
  parent?: string
  name?: string
  topOnly?: boolean
}

export interface NewFolder {
  name?: string,
  description?: string,
  parent?: string,
  path?: DocRef[],
}

export interface NewFile extends NewFolder {
  app?: string
  data?: object
}
