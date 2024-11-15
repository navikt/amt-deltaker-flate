import { Alert, Button } from '@navikt/ds-react'
import { HistorikkModal } from './HistorikkModal'
import { DeltakerHistorikkListe } from '../../model/deltakerHistorikk'
import { useEffect, useState } from 'react'
import {
  DeferredFetchState,
  useDeferredFetch
} from '../../hooks/useDeferredFetch'
import { Tiltakstype } from '../../model/deltaker'

interface Props {
  deltakerId: string
  tiltakstype: Tiltakstype
  open?: boolean
  className?: string
  fetchHistorikk: (deltakerId: string) => Promise<DeltakerHistorikkListe>
  onModalClose?: () => void
}

export const SeEndringer = ({
  deltakerId,
  tiltakstype,
  open,
  className,
  fetchHistorikk,
  onModalClose
}: Props) => {
  const [historikkModalOpen, setHistorikkModalOpen] = useState(open ?? false)

  const {
    data: historikk,
    state,
    error,
    doFetch: doFetchHistorikk
  } = useDeferredFetch(fetchHistorikk)

  const hentEndringer = () => {
    doFetchHistorikk(deltakerId).then(() => setHistorikkModalOpen(true))
  }

  useEffect(() => {
    if (open && !historikk && state === DeferredFetchState.NOT_STARTED) {
      hentEndringer()
    }
  }, [])

  return (
    <>
      <Button
        className={className ?? ''}
        variant="secondary"
        size="small"
        onClick={hentEndringer}
        loading={state === DeferredFetchState.LOADING}
        disabled={state === DeferredFetchState.LOADING}
      >
        Se endringer
      </Button>

      {error && (
        <Alert variant="error" className="mt-4" size="small" role="alert">
          Beklager, vi kunne ikke hente historiske endringer på tiltaket.
        </Alert>
      )}

      <HistorikkModal
        historikk={historikk}
        tiltakstype={tiltakstype}
        open={historikkModalOpen}
        loading={state === DeferredFetchState.LOADING}
        onClose={() => {
          setHistorikkModalOpen(false)
          if (onModalClose) onModalClose()
        }}
      />
    </>
  )
}
