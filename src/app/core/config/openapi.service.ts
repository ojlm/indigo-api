import { Injectable } from '@angular/core'
import { Case } from 'app/model/es.model'

@Injectable({
  providedIn: 'root'
})
export class OpenApiService {

  defaultImportLabels = ['swagger']

  isLabeldByOpenapi(item: Case) {
    if (item.labels && item.labels.length > 0) {
      return item.labels.findIndex(label => this.defaultImportLabels.includes(label.name)) > -1
    }
    return false
  }
}
