import { BASE_URL } from '.'

const JOB_BASE_URL = BASE_URL + '/job'

export const GET_JOB_LIST = JOB_BASE_URL + '/list'
export const GET_JOB_DETAIL = JOB_BASE_URL + '/detail'
export const GET_JOB_TYPE = JOB_BASE_URL + '/type'
export const NEW_JOB = JOB_BASE_URL + '/new'
export const GET_LOG_LIST = JOB_BASE_URL + '/log'
export const RESUME_JOB = JOB_BASE_URL + '/resume'
export const PAUSE_JOB = JOB_BASE_URL + '/pause'
export const DELETE_JOB = JOB_BASE_URL + '/delete'
export const FIRE_JOB = JOB_BASE_URL + '/fire'
export const GET_JOB_LOG_LIST = JOB_BASE_URL + '/log'
export const UPDATE_JOB = JOB_BASE_URL + '/update'

export const WS_JOB_LIST = BASE_URL + '/ws/job/list'
export const WS_JOB_TEST = BASE_URL + '/ws/job/test'
export const WS_JOB_MANUAL = BASE_URL + '/ws/job/manual'
