import { Button, GlobalAlert } from '@navikt/ds-react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { logError } from '../utils/utils'

interface Props {
  currentVersion: string
  manifestUrl: string
}

interface VersionManifest {
  version: string
}

const VERSION_CHECK_INTERVAL_MS = 5 * 60 * 1000

export const resolveVersionManifestUrl = (moduleUrl: string) =>
  new URL('version.json', moduleUrl).href

const isVersionManifest = (value: unknown): value is VersionManifest =>
  typeof value === 'object' &&
  value !== null &&
  'version' in value &&
  typeof value.version === 'string' &&
  value.version.length > 0

export const Versjonsvarsel = ({ currentVersion, manifestUrl }: Props) => {
  const harLoggetFeil = useRef(false)
  const { data: manifest, error } = useQuery({
    queryKey: ['frontend-version', manifestUrl, currentVersion],
    queryFn: async () => {
      const response = await fetch(manifestUrl, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`Versjonssjekk feilet med HTTP ${response.status}`)
      }

      const manifest: unknown = await response.json()
      if (!isVersionManifest(manifest)) {
        throw new Error('Versjonsmanifestet har ugyldig format')
      }

      return manifest
    },
    enabled: Boolean(currentVersion) && currentVersion !== 'local',
    refetchInterval: VERSION_CHECK_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    // Feilen logges lokalt én gang og kastes ikke videre til error boundary.
    retry: false,
    throwOnError: false
  })

  useEffect(() => {
    if (error && !harLoggetFeil.current) {
      logError('Kunne ikke sjekke frontend-versjon', error)
      harLoggetFeil.current = true
    }
  }, [error])

  const nyVersjonTilgjengelig = manifest && manifest.version !== currentVersion

  if (!nyVersjonTilgjengelig) return null

  return (
    <GlobalAlert
      status="announcement"
      size="small"
      centered={false}
      className="mb-4"
    >
      <GlobalAlert.Header>
        <GlobalAlert.Title as="h2">
          En ny versjon av løsningen er tilgjengelig
        </GlobalAlert.Title>
      </GlobalAlert.Header>
      <GlobalAlert.Content>
        Last inn siden på nytt for å ta den i bruk.{' '}
        <Button
          className="ml-4"
          type="button"
          size="small"
          variant="secondary"
          onClick={() => window.location.reload()}
        >
          Last inn på nytt
        </Button>
      </GlobalAlert.Content>
    </GlobalAlert>
  )
}
