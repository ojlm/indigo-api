export const BASE_URL = 'api'

export const API_USER_LOGIN = BASE_URL + '/user/login'
export const API_USER_LOGOUT = BASE_URL + '/user/logout'
/**
 * 查询接口限于 `GET` 方法无法设置 消息体, 会用 `post` 方法 加 `query` 路径
 */
export const API_GROUP = BASE_URL + '/group'
export const API_GROUP_QUERY = API_GROUP + '/query'
