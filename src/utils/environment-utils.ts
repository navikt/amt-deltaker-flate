export enum EndpointHandler {
    MOCK = 'MOCK',
    PROXY = 'PROXY',
    DEV = 'DEV',
    PROD = 'PROD'
}

export function getEndpointHandlerType(): EndpointHandler {
  return import.meta.env.VITE_ENDPOINT_HANDLER || EndpointHandler.PROD
}

export function apiUrl(): string {
  switch (getEndpointHandlerType()) {
  case EndpointHandler.MOCK:
    return 'http://localhost:3000/api/'
  case EndpointHandler.PROXY:
    return 'http://localhost:58080/'
  default:
    return 'https://amt.intern.dev.nav.no/'
  }
}

export function getRequestCookie(): string {
  return import.meta.env.VITE_MOCK_REQUEST_COOKIE || ''
}
