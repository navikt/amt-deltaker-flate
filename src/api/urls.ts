const isProduction = window.location.href.includes('www.nav.no')
const isDevelopment = window.location.href.includes('www.dev.nav.no')
const isDemo = window.location.href.includes('navikt.github.io')

export const getEnvironment = () => {
  if (isProduction) {
    return 'production'
  }

  if (isDevelopment) {
    return 'development'
  }

  if (isDemo) {
    return 'demo'
  }

  return 'local'
}

type EnvUrl = { development: string; production: string; demo: string; local: string }

const API_URL: EnvUrl = {
  local: 'http://localhost:3000/api',
  demo: 'https://navikt.github.io/api',
  development: 'https://www.dev.nav.no/api',
  production: 'https://www.nav.no/api'
}

export const apiUrl = API_URL[getEnvironment()]
