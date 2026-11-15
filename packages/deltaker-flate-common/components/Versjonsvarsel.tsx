import { Button, GlobalAlert } from '@navikt/ds-react'
import { useEffect, useRef, useState } from 'react'
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
  const [nyVersjonTilgjengelig, setNyVersjonTilgjengelig] = useState(false)
  const harLoggetFeil = useRef(false)

  useEffect(() => {
    if (!currentVersion || currentVersion === 'local') return

    let active = true
    let requestInProgress = false

    const logVersjonssjekkFeil = (reason: unknown) => {
      if (harLoggetFeil.current) return
      logError('Kunne ikke sjekke frontend-versjon', reason)
      harLoggetFeil.current = true
    }

    const sjekkVersjon = async () => {
      if (!active || requestInProgress) return
      requestInProgress = true

      try {
        const response = await fetch(manifestUrl, { cache: 'no-store' })
        if (!response.ok) {
          logVersjonssjekkFeil(
            `Versjonssjekk feilet med HTTP ${response.status}`
          )
          return
        }

        const manifest: unknown = await response.json()
        if (!isVersionManifest(manifest)) {
          logVersjonssjekkFeil('Versjonsmanifestet har ugyldig format')
          return
        }

        if (active && manifest.version !== currentVersion) {
          setNyVersjonTilgjengelig(true)
        }
      } catch (error) {
        logVersjonssjekkFeil(error)
      } finally {
        requestInProgress = false
      }
    }

    void sjekkVersjon()
    const intervalId = window.setInterval(
      () => void sjekkVersjon(),
      VERSION_CHECK_INTERVAL_MS
    )
    const sjekkVedSynligFane = () => {
      if (document.visibilityState === 'visible') {
        void sjekkVersjon()
      }
    }

    document.addEventListener('visibilitychange', sjekkVedSynligFane)

    return () => {
      active = false
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', sjekkVedSynligFane)
    }
  }, [currentVersion, manifestUrl])

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
