import { Group } from 'app/model/es.model'

export class BaseService {

  DEFAULT_DEBOUNCE_TIME = 300
}

export interface AggsQuery {
  group?: string
  project?: string
  creator?: string
  creatorPrefix?: string
  interval?: string
  termsField?: string
  dateRange?: string
  size?: number
  types?: string[]
}

export interface AggsItem {
  id?: string
  summary?: string
  description?: string
  type?: string
  count?: number
  sub?: AggsItem[]
}

export interface TrendResponse {
  groups: Group[]
  trends: AggsItem[]
}
