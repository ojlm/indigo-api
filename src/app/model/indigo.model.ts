export class AutocompleteContext {
  prefix = '$.'
  dataSource: AutocompleteContextDataSource = {
    status: 200,
    headers: {},
    entity: {}
  }
}

export interface AutocompleteContextDataSource {
  status?: number
  headers?: Object
  entity?: string | Object
}
