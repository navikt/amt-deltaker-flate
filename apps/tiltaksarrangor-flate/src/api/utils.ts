import axios, { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import { z, ZodType } from 'zod'

import { APP_NAME } from '../utils/constants'

type ApiEndpoint =
  | 'featureToggles'
  | 'roles'
  | 'adminDeltakerlister'
  | 'adminDeltakerliste'
  | 'coordinatorDeltakerliste'
  | 'coordinatorMineDeltakerlister'
  | 'veilederMineDeltakere'
  | 'deltaker'
  | 'tilgjengeligeVeiledere'
  | 'tildelVeileder'
  | 'deltakerVurdering'
  | 'deltakerEndring'
  | 'markerEndringSomLest'
  | 'deltakerHistorikk'
  | 'deltakerForslag'
  | 'tilbakekallForslag'

type RequestContext = {
  deltakerId?: string
  deltakerlisteId?: string
  forslagId?: string
  ulestEndringId?: string
  operation?: string
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const SAFE_OPERATIONS = new Set([
  'legg-til-oppstartsdato',
  'forleng',
  'ikke-aktuell',
  'avslutt',
  'endre-avslutning',
  'deltakelsesmengde',
  'startdato',
  'sluttarsak',
  'fjern-oppstartsdato'
])

const SAFE_METHODS = new Set(['GET', 'POST', 'DELETE', 'PUT', 'PATCH'])

const SAFE_AXIOS_ERROR_CODES = new Set([
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
])

export const axiosInstance = axios.create({
  withCredentials: true,
  headers: { 'Nav-Consumer-Id': APP_NAME }
})

export const dateSchema = z.preprocess((arg) => {
  if (typeof arg == 'string') return dayjs(arg).toDate()
}, z.date())

export const nullableDateSchema = z.preprocess((arg) => {
  if (!arg) return null
  if (typeof arg == 'string') return dayjs(arg).toDate()
}, z.date().nullable())

export function parse<T>(
  schema: ZodType<T>
): (r: AxiosResponse) => AxiosResponse<T> {
  return (res: AxiosResponse) => ({ ...res, data: schema.parse(res.data) })
}

export function logAndThrowError<E = Error>(
  err: E,
  endpoint: ApiEndpoint,
  context: RequestContext = {}
): E {
  const isAxiosError = axios.isAxiosError(err)
  const method = isAxiosError ? err.config?.method?.toUpperCase() : undefined
  const errorCode =
    isAxiosError && err.code && SAFE_AXIOS_ERROR_CODES.has(err.code)
      ? err.code
      : undefined

  console.error('Request failed', {
    endpoint,
    method: method && SAFE_METHODS.has(method) ? method : undefined,
    httpStatus: isAxiosError ? err.response?.status : undefined,
    errorCode,
    ...(context.deltakerId && UUID_PATTERN.test(context.deltakerId)
      ? { deltakerId: context.deltakerId }
      : {}),
    ...(context.deltakerlisteId && UUID_PATTERN.test(context.deltakerlisteId)
      ? { deltakerlisteId: context.deltakerlisteId }
      : {}),
    ...(context.forslagId && UUID_PATTERN.test(context.forslagId)
      ? { forslagId: context.forslagId }
      : {}),
    ...(context.ulestEndringId && UUID_PATTERN.test(context.ulestEndringId)
      ? { ulestEndringId: context.ulestEndringId }
      : {}),
    ...(context.operation && SAFE_OPERATIONS.has(context.operation)
      ? { operation: context.operation }
      : {})
  })

  throw err
}
