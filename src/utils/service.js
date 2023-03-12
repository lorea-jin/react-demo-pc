import axios from 'axios'
import { GetToken, HasToken, RemoveToken } from './localstorage'
import history from './histroy'
import { message } from 'antd'
export const baseURL='http://geek.itheima.net/v1_0/'
const service = axios.create({
  baseURL,
  timeout: 5000,
})

service.interceptors.request.use(config => {
  if (HasToken()) {
    config.headers.Authorization = `Bearer ${GetToken()}`
  }
  return config
})

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
		console.log(error);
    if (error.response.status === 401) {
      RemoveToken()
			message.warning('身份信息过期')
			history.push('/login')
    }
    return Promise.reject(error)
  }
)
export default service
