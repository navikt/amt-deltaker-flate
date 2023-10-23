const isProduction = window.location.href.includes('www.nav.no')
const isDevelopment = window.location.href.includes('www.dev.nav.no')

export const getEnvironment = () => {
  if (isProduction) {
    return 'production'
  }

  if (isDevelopment) {
    return 'development'
  }

  return 'local'
}

type EnvUrl = { development: string; production: string; local: string };

const API_URL: EnvUrl = {
  local: 'http://localhost:3000/api/endpoint',
  development: 'https://www.dev.nav.no/api/endpoint',
  production: 'https://www.nav.no/api/endpoint',
}

export const apiUrl = API_URL[getEnvironment()]
