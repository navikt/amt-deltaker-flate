interface TransportItem {
  meta?: {
    page?: {
      url?: string
    }
  }
}

type FaroEnvironment = 'dev-gcp' | 'prod-gcp'

const faroConfigByMode: Record<
  string,
  { environment: FaroEnvironment; telemetryUrl: string }
> = {
  dev: {
    environment: 'dev-gcp',
    telemetryUrl: 'https://telemetry.ekstern.dev.nav.no/collect'
  },
  production: {
    environment: 'prod-gcp',
    telemetryUrl: 'https://telemetry.nav.no/collect'
  }
}

export function resolveFaroEnvironment(
  mode: string,
  telemetryUrl?: string
): FaroEnvironment | undefined {
  const config = faroConfigByMode[mode]
  if (!config || config.telemetryUrl !== telemetryUrl) {
    return undefined
  }
  return config.environment
}

export function faroBeforeSend<T extends TransportItem>(item: T): T {
  // Fjern query-parametere og fragmenter fra side-URLer.
  // Kan inneholde tokens, autorisasjonskoder eller andre identifikatorer.
  if (item.meta?.page?.url) {
    try {
      const url = new URL(item.meta.page.url)
      url.search = ''
      url.hash = ''
      item.meta.page.url = url.toString()
    } catch {
      /* ignore malformed URLs */
    }
  }

  return item
}
