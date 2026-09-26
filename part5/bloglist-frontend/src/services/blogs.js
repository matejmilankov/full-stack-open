import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
}

const getConfig = () => ({
  headers: { Authorization: token }
})

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blog) => {
  const response = await axios.post(baseUrl, blog, getConfig());
  return response.data;
}

const like = async (blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, getConfig());
  return response.data;
}

const remove = async (blogId) => {
  await axios.delete(`${baseUrl}/${blogId}`, getConfig());
}

export default { 
  getAll, 
  setToken, 
  create,
  like,
  remove
}