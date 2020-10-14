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

  UPLOAD_BLOB = `${API_BLOB}/upload`
  DOWNLOAD_BLOB = `${API_BLOB}/download`

  uploadBlob(formData: FormData) {
    return this.http.post<ApiRes<BlobMetaData>>(`${API_BLOB}/upload`, formData)
  }

  downloadBlob(key: string, fileName: string) {
    this.http.get(`${this.DOWNLOAD_BLOB}/${key}`, null, { responseType: 'blob' }).subscribe(res => {
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
