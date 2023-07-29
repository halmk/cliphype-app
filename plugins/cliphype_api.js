import axios from 'axios'

const ClipHypeAPI = {
  apiURL: '',

  getRequest: async (query, params) => {
    const url = `${ClipHypeAPI.apiURL}/${query}`
    console.log(params, url)
    return await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${ClipHypeAPI.token}`,
      },
    })
  },

  postRequest: async (query, data) => {
    const url = `${ClipHypeAPI.apiURL}/${query}`
    console.log(data, url)
    return await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${ClipHypeAPI.token}`,
      },
    })
  },

  getAutoClips: async (params) => {
    const query = 'autoclips'
    return await ClipHypeAPI.getRequest(query, params)
  },
}

export default ({ app }, inject) => {
  inject('cliphype', ClipHypeAPI)
}
