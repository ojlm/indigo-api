import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { DocRef } from 'app/model/job.model'
import { APP, FileNode } from 'app/routes/ui/ui.model'
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

  getUploadUrl(group: string, project: string) {
    return `${API_FILES}/${group}/${project}/upload`
  }

  get(group: string, project: string, id: string) {
    return this.http.get<ApiRes<FileNode>>(`${API_FILES}/${group}/${project}/${id}`)
  }

  query(group: string, project: string, query: QueryFile) {
    return this.http.post<ApiRes<FileNode[]>>(`${API_FILES}/${group}/${project}/query`, query)
  }

  newFile(group: string, project: string, doc: NewFile) {
    return this.http.put(`${API_FILES}/${group}/${project}/file`, doc) as Observable<ApiRes<NewResponse>>
  }

  newFolder(group: string, project: string, doc: NewFolder) {
    return this.http.put(`${API_FILES}/${group}/${project}/folder`, doc) as Observable<ApiRes<NewResponse>>
  }

  toChildPath(file: FileNode): DocRef[] {
    if (file) {
      if (file.path) {
        return [...file.path, { id: file._id }]
      } else {
        return [{ id: file._id }]
      }
    } else {
      return undefined
    }
  }

  getImgSrc(item: FileNode) {
    switch (item.app) {
      case APP.KARATE:
      case APP.SOLOPI:
      case APP.WEB_MONKEY:
        return `/assets/svg/${item.app}.svg`
      default:
        switch (item.extension) {
          case 'json':
            return `/assets/svg/${item.extension}.svg`
          default:
            return '/assets/svg/file.svg'
        }
    }
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

export interface NewResponse {
  id?: string
  doc?: FileNode
}
