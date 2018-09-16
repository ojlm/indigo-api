import { Job } from './es.model'

export interface JobMeta {
  group?: string
  project?: string
  summary?: string
  description?: string
  scheduler?: string
  classAlias?: string
}

export interface TriggerMeta {
  group?: string
  project?: string
  cron?: string
  triggerType?: string
  startNow?: boolean
  startDate?: number
  endDate?: number
  repeatCount?: number
  interval?: number
}

export interface DocRef {
  id?: string
}
export interface JobData {
  cs?: DocRef[]
  scenario?: DocRef[]
  ext?: any
}

export interface JobListItem extends Job {
  state?: string
}

export interface JobExecLog {
  id: number
  elapse: number
  errorMsg: string
  jobGroup: string
  jobName: string
  schedName: string
  startAt: string
  endAt: string
  status: number
}

export const TriggerType = {
  MANUAL: 'manual',
  SIMPLE: 'simple',
  CRON: 'cron',
  API: 'api',
}
