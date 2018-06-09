import { Job } from './es.model'

export interface JobMeta {
  name?: string
  group?: string
  desc?: string
  scheduler?: string
  classAlias?: string
}

export interface TriggerMeta {
  name?: string
  group?: string
  desc?: string
  startNow?: boolean
  startDate?: number | Date
  endDate?: number | Date
  repeatCount?: number
  interval?: number
  cron?: string
  triggerType?: string
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
