export const BASE_URL = 'api'

export const API_HOME = BASE_URL + '/home'
export const API_USER = BASE_URL + '/user'
export const API_USER_LOGIN = BASE_URL + '/user/login'
export const API_USER_LOGOUT = BASE_URL + '/user/logout'
/**
 * 查询接口限于 `GET` 方法无法设置 消息体, 会用 `post` 方法 加 `query` 路径
 */
export const API_GROUP = BASE_URL + '/group'
export const API_GROUP_QUERY = API_GROUP + '/query'

export const API_PROJECT = BASE_URL + '/project'
export const API_PROJECT_QUERY = API_PROJECT + '/query'

export const API_API = BASE_URL + '/api'
export const API_API_GET_ONE = API_API + '/getOne'
export const API_API_QUERY = API_API + '/query'

export const API_CASE = BASE_URL + '/cs'
export const API_CASE_UPDATE = API_CASE + '/update'
export const API_CASE_QUERY = API_CASE + '/query'
export const API_CASE_TEST = API_CASE + '/test'

export const API_SCENARIO = BASE_URL + '/scenario'
export const API_SCENARIO_QUERY = API_SCENARIO + '/query'

export const API_ENV = BASE_URL + '/env'
export const API_ENV_QUERY = API_ENV + '/query'

export const API_OPENAPI = BASE_URL + '/openapi'

export const API_JOB = BASE_URL + '/job'
export const API_JOB_QUERY = API_JOB + '/query'
export const API_JOB_CRON = API_JOB + '/cron'

export const API_WS_SCENARIO_TEST = '/api/ws/scenario/test'
export const API_WS_JOB_TEST = '/api/ws/job/test'
export const API_WS_JOB_MANUAL = '/api/ws/job/manual'

export const API_LINKERD_V1_DTABS_HTTP = BASE_URL + '/linkerd/v1/dtabs/http'

export const API_SYSTEM = BASE_URL + '/sys'

export const API_ACTIVITY = BASE_URL + '/activity'
export const API_ONLINE = BASE_URL + '/online'
export const API_DUBBO = BASE_URL + '/dubbo'
