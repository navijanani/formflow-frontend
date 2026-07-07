import api from './api'

export async function listForms(page = 1, pageSize = 10) {
  const { data } = await api.get('/forms', {
    params: { page, page_size: pageSize }
  })
  return data
}

export async function createForm(payload) {
  const { data } = await api.post('/forms', payload)
  return data
}

export async function getForm(formId) {
  const { data } = await api.get(`/forms/${formId}`)
  return data
}

export async function updateForm(formId, payload) {
  const { data } = await api.put(`/forms/${formId}`, payload)
  return data
}

export async function deleteForm(formId) {
  await api.delete(`/forms/${formId}`)
}

export async function getPublicForm(publicId) {
  const { data } = await api.get(`/public/forms/${publicId}`)
  return data
}

export async function submitPublicForm(publicId, payload) {
  const { data } = await api.post(`/public/forms/${publicId}/submit`, payload)
  return data
}

export async function getPublicResponse(publicId, responseId) {
  const { data } = await api.get(`/public/forms/${publicId}/response/${responseId}`)
  return data
}

export async function updatePublicResponse(publicId, responseId, payload) {
  const { data } = await api.put(`/public/forms/${publicId}/response/${responseId}`, payload)
  return data
}

export async function getFormAnalytics(formId) {
  const { data } = await api.get(`/forms/${formId}/analytics`)
  return data
}

export async function downloadExcel(formId) {
  const response = await api.get(`/forms/${formId}/export/excel`, { responseType: "blob" })
  const disposition = response.headers["content-disposition"]
  let filename = "responses.xlsx"
  if (disposition) {
    const match = disposition.match(/filename="?(.+?)"?$/)
    if (match) filename = match[1]
  }
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
