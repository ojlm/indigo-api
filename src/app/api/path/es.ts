import { BASE_URL } from './index'
const ES_BASE_URL = BASE_URL + '/es'

export const INDEX_GROUP = ES_BASE_URL + '/group/index'
export const UPDATE_GROUP = ES_BASE_URL + '/group/update'
export const DELETE_GROUP = ES_BASE_URL + '/group/delete'
export const GET_GROUP_LIST = ES_BASE_URL + '/group/query'

export const INDEX_PROJECT = ES_BASE_URL + '/project/index'
export const DELETE_PROJECT = ES_BASE_URL + '/project/delete'
export const GET_PROJECT_LIST = ES_BASE_URL + '/project/query'
export const UPDATE_PROJECT = ES_BASE_URL + '/project/update'

export const INDEX_API = ES_BASE_URL + "/api/index"
export const UPDATE_API = ES_BASE_URL + "/api/update"
export const DELETE_API = ES_BASE_URL + "/api/delete"
export const GET_API_LIST = ES_BASE_URL + "/api/query"
export const IMPORT_API = ES_BASE_URL + "/api/import"
export const GET_API_BY_IDS = ES_BASE_URL + "/api/getByIds"

export const INDEX_CASE = ES_BASE_URL + "/case/index"
export const UPDATE_CASE = ES_BASE_URL + "/case/update"
export const GET_CASE_LIST = ES_BASE_URL + "/case/query"
export const DO_CASE_TEST = ES_BASE_URL + "/case/test"
export const DELETE_CASE = ES_BASE_URL + "/case/delete"
export const SEARCH_CASE = ES_BASE_URL + "/case/search"
export const GET_CASE_BY_IDS = ES_BASE_URL + "/case/getByIds"

export const INDEX_ENV = ES_BASE_URL + '/env/index'
export const DELETE_ENV = ES_BASE_URL + '/env/delete'
export const GET_ENV_LIST = ES_BASE_URL + '/env/query'
export const UPDATE_ENV = ES_BASE_URL + '/env/update'
