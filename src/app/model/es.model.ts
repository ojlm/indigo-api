import { GenericRequest } from 'app/api/service/dubbo.service'

import { DataBody } from './api.model'
import { AbstractResult, JobData } from './job.model'
import { UserProfile } from './user.model'

interface BaseDoc {
  _id?: string
  _creator?: UserProfile
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

export interface FieldPattern {
  field?: string
  value?: string
  type?: string
}

export interface Project extends BaseDoc {
  id?: string
  group?: string
  avatar?: string
  openapi?: string
  domains?: LabelRef[]
  inclusions?: FieldPattern[]
  exclusions?: FieldPattern[]
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
  project?: string
  group?: string
  request?: CaseRequest
  /** 后端为Map类型, 前端组件内为 string */
  assert?: any
  env?: string
  labels?: LabelRef[]
  generator?: CaseGenerator
}

export interface ScenarioStep {
  id?: string
  type?: string
  stored?: boolean
  enabled?: boolean
  data?: any
}

export interface Scenario extends BaseDoc {
  group?: string
  project?: string
  env?: string
  steps?: ScenarioStep[]
  labels?: LabelRef[]
}

export interface KeyValueObject {
  key?: string
  value?: string
  enabled?: boolean
}

export interface MediaObject {
  contentType?: string
  data?: any
}

export interface CaseRequest {
  protocol?: string
  host?: string
  rawUrl?: string
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
  headers?: Object
  body?: string
}

export interface CaseResultResponse {
  statusCode?: number
  statusMsg?: string
  headers?: Object
  contentType?: string
  body?: string
}

export interface CaseReportItemMetrics {
  renderRequestTime?: number
  renderAuthTime?: number
  requestTime?: number
  evalAssertionTime?: number
  totalTime?: number
}

export interface CaseResult extends AbstractResult {
  request?: CaseResultRequest
  response?: CaseResultResponse
}

export const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE']
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

export interface AuthorizeAndValidate {
  type?: string
  description?: string
  template?: string
}

export interface Authorization {
  type?: string
  data?: object
}

export interface Environment extends BaseDoc {
  group?: string
  project?: string
  auth?: Authorization[]
  namespace?: string
  enableProxy?: boolean
  server?: string
  custom?: KeyValueObject[]
  headers?: KeyValueObject[]
}

export interface IndexResultData {
  result?: string
  _id?: string
  _index?: string
  _type?: string
  _version?: number
}


export interface JobTrigger {
  project?: string
  group?: string
  startNow?: boolean
  startDate?: number
  endDate?: number
  repeatCount?: number
  interval?: number
  cron?: string
  triggerType?: string
}

export interface Job extends BaseDoc {
  classAlias?: string
  createdAt?: string
  group?: string
  project?: string
  env?: string
  scheduler?: string
  jobData?: JobData
  trigger?: JobTrigger[]
}

export interface JobReportData {
  dayIndexSuffix?: string
  cases?: CaseReportItem[]
  scenarios?: ScenarioReportItem[]
  ext?: Object
}

export interface CaseDataItemRequest {
  method?: string
  url?: string
  headers?: object
  body?: string
}

export interface JobReportDataItem {
  reportId?: string
  caseId?: string
  scenarioId?: string
  jobId?: string
  metrics?: CaseReportItemMetrics
  request?: CaseDataItemRequest
  response?: CaseResultResponse
  assertions?: Object
  assertionsResult?: Object
}

export interface JobReportDataStatistic {
  caseCount?: number
  caseOK?: number
  caseKO?: number
  scenarioCount?: number
  scenarioOK?: number
  scenarioKO?: number
  scenarioCaseCount?: number
  scenarioCaseOK?: number
  scenarioCaseKO?: number
  scenarioCaseOO?: number
  okRate?: number
  assertionPassed?: number
  assertionFailed?: number
}

export interface JobReport extends BaseDoc {
  scheduler?: string
  group?: string
  project?: string
  type?: string
  jobId?: string
  jobName?: string
  classAlias?: string
  startAt?: string
  endAt?: string
  elapse?: number
  result?: string
  errorMsg?: string
  node?: string
  data?: JobReportData
  statis?: JobReportDataStatistic
}

export interface JobNotify extends BaseDoc {
  group?: string
  project?: string
  jobId?: string
  subscriber?: string
  type?: string
  trigger?: string
  enabled?: boolean
  data?: Object
}

export interface JobExecDesc {
  job?: Job
  report?: JobReport
}

export interface CaseReportItem {
  id?: string
  title?: string
  itemId?: string
  status?: string
  msg?: string
  statis?: CaseStatis
}

export interface ScenarioReportItem {
  id?: string
  title?: string
  status?: string
  msg?: string
  steps?: CaseReportItem[]
}

export interface JobReportData {
  cases?: CaseReportItem[]
  scenarios?: ScenarioReportItem[]
  ext?: Object
}

export interface IndexDocResponse {
  id?: string
}

export interface UpdateDocResponse {
  id?: string
  result?: string
}

export interface Assertion {
  name?: string
  description?: string
}

export interface CaseGeneratorListItem {
  map?: KeyValueObject[]
  assert?: any
}

export interface CaseGenerator {
  script?: string
  list?: CaseGeneratorListItem[]
  count?: number
}

export interface ReportItemEvent {
  index?: number
  status?: string
  errMsg?: string
  result?: CaseResult
}

export interface ContextOptions {
  jobEnv?: string
  scenarioEnv?: string
  caseEnv?: string
  initCtx?: Object
}

export interface DeleteResData {
  case?: DataBody<Case[]>
  scenario?: DataBody<Scenario[]>
  job?: DataBody<Job[]>
}

export interface DomainOnlineLog {
  name?: string
  tag?: string
  count?: number
  date?: string
  coverage?: number
}

export interface RestApiOnlineLog {
  domain?: string
  tag?: string
  method?: string
  urlPath?: string
  count?: number
  percentage?: number
  belongs?: GroupProject[]
  metrics?: Metrics
}

export interface Metrics {
  p25?: number
  p50?: number
  p75?: number
  p90?: number
  p95?: number
  p99?: number
  p999?: number
  min?: number
  avg?: number
  max?: number
}

export interface GroupProject {
  group?: string
  project?: string
  covered?: boolean
  count?: number
}

export interface ProjectApiCoverage {
  group?: string
  project?: string
  domain?: string
  date?: string
  coverage?: number
}

export interface FieldPattern {
  field?: string
  value?: string
  alias?: string
  type?: string
}

export interface DomainOnlineConfig extends BaseDoc {
  domain?: string
  tag?: string
  maxApiCount?: number
  minReqCount?: number
  exSuffixes?: string
  inclusions?: FieldPattern[]
  exclusions?: FieldPattern[]
  exMethods?: LabelRef[]
}

export interface DubboRequestBody extends GenericRequest {
  zkAddr?: string
  zkPort?: number
  path?: string
}

export interface DubboRequest extends BaseDoc {
  group?: string
  project?: string
  env?: string
  request?: DubboRequestBody
  generator?: CaseGenerator
  assert?: object
  labels?: LabelRef[]
}

export interface SqlRequestBody {
  host?: string
  port?: number
  username?: string
  password?: string
  encryptedPass?: string
  database?: string
  table?: string
  sql?: string
}

export interface SqlRequest extends BaseDoc {
  group?: string
  project?: string
  env?: string
  request?: SqlRequestBody
  assert?: object
  labels?: LabelRef[]
  generator?: CaseGenerator
}
