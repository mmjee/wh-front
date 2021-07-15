import axios from 'axios'

class APIError extends Error {
  constructor (req, res) {
    super('Server encountered an error')

    this.status = res.status
    this.req = req
    this.res = res
  }
}

class ApplicationError extends Error {
  constructor (req, res) {
    super('Application encountered error')
    this.req = req
    this.res = res

    this.errorCode = res.errorCode
    this.errorMessage = res.errorMessage || null
  }
}

class AuthenticationError extends APIError {}
class NotFoundError extends APIError {}
class BadRequestError extends APIError {}
class ServiceUnavailableError extends APIError {}

class WarehouseAPI {
  axios = axios

  APIError = APIError
  ApplicationError = ApplicationError
  AuthenticationError = AuthenticationError
  NotFoundError = NotFoundError
  BadRequestError = BadRequestError
  ServiceUnavailableError = ServiceUnavailableError

  async do (req) {
    let resp
    try {
      resp = (await axios(req)).data
    } catch (e) {
      return this.handleErr(e)
    }
    if (resp.error) {
      throw new ApplicationError(req, resp)
    }

    return resp
  }

  async getByPath (path, extra = {}) {
    return this.do({
      method: 'GET',
      url: path,
      ...extra
    })
  }

  async postToPath (path, data, extra = {}) {
    return this.do({
      method: 'POST',
      url: path,
      data,
      ...extra
    })
  }

  async putToPath (path, data, extra = {}) {
    return this.do({
      method: 'PUT',
      url: path,
      data,
      ...extra
    })
  }

  async handleErr (e) {
    if (!e.isAxiosError) {
      throw e
    }

    if (e.response.status === 404) {
      throw new NotFoundError(e.request, e.response)
    } else if (e.response.status === 400) {
      throw new BadRequestError(e.request, e.response)
    } else if (e.response.status === 401) {
      throw new AuthenticationError(e.request, e.response)
    } else if (e.response.status === 503) {
      throw new ServiceUnavailableError(e.request, e.response)
    }
  }
}

const WA = new WarehouseAPI()
if (process.env.NODE_ENV !== 'production') {
  window.WarehouseAPI = WA
}
export {
  WA as WarehouseAPI
}
