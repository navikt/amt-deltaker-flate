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
  const baseUrl = import.meta.env.VITE_ENDPOINT_HANDLER

  if(!baseUrl || baseUrl === '') {
    return import.meta.env.BASE_URL
  }
  
  return baseUrl
}
