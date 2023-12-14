export enum EndpointHandler {
    MOCK = 'MOCK',
    PROXY = 'PROXY',
    DEV = 'DEV',
    PROD = 'PROD'
}

export const getEndpointHandlerType = (): EndpointHandler => {
  return import.meta.env.VITE_ENDPOINT_HANDLER || EndpointHandler.PROD
}

export const deltakerBffApiBasePath = (): string => {
  switch (getEndpointHandlerType()) {
  case EndpointHandler.MOCK:
    return '/mock'
  case EndpointHandler.PROXY:
    return 'http://localhost:58080'
  default:
    return `${import.meta.env.BASE_URL.replace(/\/pr-\d+\//, '')}/amt-deltaker-bff`

  }
}

export const getCurrentMode = () => {
  return import.meta.env.VITE_MODE
}
