import request from 'utils/service.js'

export function getTable(data) {
  return request({
    url: 'mp/articles',
    method: 'get',
    params: data,
  })
}

export function getChannel(data) {
  return request({
    url: '/channels',
    method: 'get',
    params: data,
  })
}

export function deleteArticle(id) {
  return request({
    url: `/mp/articles/${id}`,
    method: 'DELETE',
  })
}

export function publishArticle(data, draft = false) {
  return request({
    url: `/mp/articles?draft=${draft}`,
    method: 'POST',
    data,
  })
}

export function getArticle(id) {
  return request({
    url: `/mp/articles/${id}`,
    method: 'get',
  })
}

export function editArticle(data, draft = false, id) {
  return request({
    url: `/mp/articles/${id}?draft=${draft}`,
    method: 'PUT',
    data,
  })
}
