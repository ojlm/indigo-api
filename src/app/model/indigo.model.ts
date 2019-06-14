import { DubboResult } from 'app/api/service/dubbo.service'
import { SqlResult } from 'app/api/service/sql.service'

import { CaseResult } from './es.model'

export class AutocompleteContext {

  prefix = '$'
  dataSource: AutocompleteContextDataSource = {
    status: 200,
    headers: {},
    entity: {}
  }

  refeshFromHttpResult(val: CaseResult) {
    if (val.response && val.response.statusCode && val.response.headers) {
      this.dataSource.status = val.response.statusCode
      this.dataSource.headers = val.response.headers
      try {
        if (val.response.contentType.startsWith('application/javascript') || val.response.contentType.startsWith('text/html')) {
          this.dataSource.entity = val.response.body
        } else {
          // application/json
          if (typeof val.response.body === 'string') {
            const bodyJson = JSON.parse(val.response.body)
            this.dataSource.entity = bodyJson
          } else {
            this.dataSource.entity = val.response.body
          }
        }
      } catch (error) {
        this.dataSource.entity = val.response.body
      }
    }
  }

  refeshFromDubboResult(val: DubboResult) {
    delete this.dataSource.status
    delete this.dataSource.headers
    if (val && val.response && val.response.body) {
      this.dataSource.entity = val.response.body
    }
  }

  refeshFromSqlResult(val: SqlResult) {
    delete this.dataSource.status
    delete this.dataSource.headers
    if (val && val.response && val.response.body) {
      this.dataSource.entity = val.response.body
    }
  }
}

export interface AutocompleteContextDataSource {
  status?: number
  headers?: Object
  entity?: string | Object
}
