export const BASE_URL = 'api'

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
export const API_CASE_QUERY = API_CASE + '/query'

export const API_ENV = BASE_URL + '/env'
export const API_ENV_QUERY = API_ENV + '/query'
