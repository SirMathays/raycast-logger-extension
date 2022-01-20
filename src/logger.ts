import { getPreferenceValues } from "@raycast/api"
import { ErrorText, PresentableError } from "./exception"
import axios, { AxiosResponse } from 'axios'

const prefs: { token: string } = getPreferenceValues()
export const loggerUrl = `http://logger.test`

export const loggerApi = axios.create({
  baseURL: loggerUrl,
  headers: {
    Accept: "application/json",
    Authorization: "Bearer " + Buffer.from(prefs.token),
  }
})

loggerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response);
  }
)

type StatusErrors = { [key: number]: ErrorText };

const defaultStatusErrors: StatusErrors = {
  401: ErrorText("Logger Authentication failed", "Check your Logger credentials in the preferences."),
}

function throwIfResponseNotOkay(response: AxiosResponse, statusErrors?: StatusErrors) {
  const status = response.status
  const definedStatus = statusErrors ? { ...defaultStatusErrors, ...statusErrors } : defaultStatusErrors
  const exactStatusError = definedStatus[status]
  if (exactStatusError) return new PresentableError(exactStatusError.name, exactStatusError.message)
  else if (status >= 500) return new PresentableError("Logger Error", `Server error ${status}`)
  else return new PresentableError("Logger Error", `Request error ${status}`)
}