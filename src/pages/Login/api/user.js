import request from 'utils/service.js'

export function login(data){
	return request({
		url:'/authorizations',
		method:'post',
		data
	})
}


export function getUserProfile(data){
	return request({
		url:'/user/profile',
		method:'get',
		params:data
	})
}