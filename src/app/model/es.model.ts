import { JobData } from './job.model'

interface BaseDoc {
  _id?: string
  summary?: string
  description?: string
  creator?: string
  createdAt?: string
}

export interface LabelRef {
  name?: string
}

export interface Label extends LabelRef {
  owner?: string
  name?: string
  description?: string
  value?: string
  type?: string
}

export interface Group extends BaseDoc {
  id?: string
  avatar?: string
}

export interface Project extends BaseDoc {
  id?: string
  group?: string
  avatar?: string
}

export interface Api extends BaseDoc {
  type?: string
  path?: string
  method?: string
  deprecated?: boolean
  service?: string
  version?: string
  labels?: LabelRef[]
  schema?: Object & string
  project?: string
  group?: string
}

export interface Case extends BaseDoc {
  creator?: string
  api?: string
  project?: string
  group?: string
  request?: CaseRequest
  assert?: Object
  env?: string
  useEnv?: boolean
  labels?: LabelRef[]
  namespace?: string
  useProxy?: boolean
}

export interface KeyValueObject {
  key?: string
  value?: string
  enabled?: boolean
}

export interface MediaObject {
  contentType?: string
  data?: string
}

export interface CaseRequest {
  protocol?: string
  host?: string
  urlPath?: string
  port?: number
  auth?: Authorization
  method?: string
  path?: KeyValueObject[]
  query?: KeyValueObject[]
  header?: KeyValueObject[]
  cookie?: KeyValueObject[]
  contentType?: string
  body?: MediaObject[]
}

export interface CaseStatis {
  failed?: number
  passed?: number
  isSuccessful?: boolean
}

export interface CaseResultRequest {
  method?: string
  url?: string
  headers?: KeyValueObject[]
  body?: string
}

export interface CaseResult {
  assert?: any
  context?: any
  result?: any
  request?: CaseResultRequest
  statis?: CaseStatis
}

export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'CONNECT', 'HEAD', 'OPTIONS', 'TRACE']
export const PROTOCOLS = ['http', 'https']
export const ContentTypes = {
  JSON: 'application/json',
  X_WWW_FORM_URLENCODED: 'application/x-www-form-urlencoded',
  TEXT_PLAIN: 'text/plain',
}

export interface ApiImport {
  openApi?: string
  group?: string
  project?: string
  preview?: boolean
}

export interface AuthorizationData {
  // CommonSign
  appKey?: string
  appSecret?: string
  // SSO Token
  cookie?: string
  header?: string
  username?: string
  password?: string
}

export interface Authorization {
  type?: string
  data?: AuthorizationData
}

export interface Environment extends BaseDoc {
  group?: string
  project?: string
  protocol?: string
  host?: string
  port?: number
  auth?: Authorization
  creator?: string
  createdAt?: string
}

export interface IndexResultData {
  result?: string
  _id?: string
  _index?: string
  _type?: string
  _version?: number
}


export interface JobTrigger {
  name?: string
  group?: string
  description?: string
  startNow?: boolean
  startDate?: number | Date
  endDate?: number | Date
  repeatCount?: number
  interval?: number
  cron?: string
  triggerType?: string
}

export interface Job extends BaseDoc {
  classAlias?: string
  createdAt?: string
  group?: string
  name?: string
  scheduler?: string
  state?: string
  jobData?: JobData
  trigger?: JobTrigger[]
}

export interface JobReport extends BaseDoc {
  scheduler?: string
  group?: string
  jobName?: string
  classAlias?: string
  startAt?: string
  endAt?: string
  elapse?: number
  result?: string
  errorMsg?: string
  node?: string
  data?: {
    type?: string
    data?: string
  }
}

export interface JobExecDesc {
  job?: Job
  report?: JobReport
}

export interface CaseReportItem {
  id?: string
  title?: string
  status?: string
  msg?: string
  result?: CaseResult
}

export interface ScenarioReportItem {
  id?: string
  title?: string
  status?: string
  msg?: string
}

export interface JobReportData {
  cases?: CaseReportItem[]
  scenarios?: ScenarioReportItem[]
  ext?: Object
}

export interface QueryCase {
  isParrent?: boolean
  api?: string
  project?: string
  group?: string
  text?: string
  from?: number
  size?: number
}

export interface QueryJobReport {
  scheduler?: string
  group?: string
  classAlias?: string
  type?: string
  from?: number
  size?: number
}

export interface IndexDocResponse {
  id?: string
}
