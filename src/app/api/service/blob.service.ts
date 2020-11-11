import { Injectable } from '@angular/core'
import { _HttpClient } from '@delon/theme'
import { BlobMetaData } from 'app/model/es.model'
import { NzMessageService } from 'ng-zorro-antd'

import { APICODE, ApiRes, ApiResObj } from '../../model/api.model'
import { API_BLOB } from '../path'
import { BaseService } from './base.service'

@Injectable({
  providedIn: 'root'
})
export class BlobService extends BaseService {

  constructor(
    private http: _HttpClient,
    private msgService: NzMessageService,
  ) { super() }

  getUploadUrl(group: string, project: string) {
    return `${API_BLOB}/${group}/${project}/upload`
  }

  uploadBlob(group: string, project: string, formData: FormData) {
    return this.http.post<ApiRes<BlobMetaData>>(`${API_BLOB}/${group}/${project}/upload`, formData)
  }

  downloadBlob(group: string, project: string, key: string, fileName: string) {
    this.http.get(`${API_BLOB}/${group}/${project}/download/${key}`, null, { responseType: 'blob' }).subscribe(res => {
      if (res.type === 'application/json') {
        res.text().then(txt => {
          try {
            const apiRes = JSON.parse(txt) as ApiResObj
            if (apiRes.code !== APICODE.OK) {
              this.msgService.error(apiRes.msg)
            }
          } catch (error) {
            this.msgService.error(error)
          }
        })
      } else {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(res)
        a.download = fileName
        a.click()
      }
    })
  }
}
