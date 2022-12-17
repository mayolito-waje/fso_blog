/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const setToken = (newToken) => {
 token = `bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = async (blog) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const request = await axios.post(baseUrl, blog, config)
  return request.data
}

const update = async (id, updates) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const request = await axios.patch(`${baseUrl}/${id}`, updates, config)
  return request.data
}

export default { getAll, create, setToken, update }