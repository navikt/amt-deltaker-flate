import { Alert, Button } from '@navikt/ds-react'
import { HistorikkModal } from './HistorikkModal'
import { DeltakerHistorikkListe } from '../../model/deltakerHistorikk'
import { useState } from 'react'
import {
  DeferredFetchState,
  useDeferredFetch
} from '../../hooks/useDeferredFetch'
import { Tiltakstype } from '../../model/deltaker'

interface Props {
  deltakerId: string
  tiltakstype: Tiltakstype
  className?: string
  fetchHistorikk: (deltakerId: string) => Promise<DeltakerHistorikkListe>
}

export const SeEndringer = ({
  deltakerId,
  tiltakstype,
  className,
  fetchHistorikk
}: Props) => {
  const [historikkModalOpen, setHistorikkModalOpen] = useState(false)

  const {
    data: historikk,
    state,
    error,
    doFetch: doFetchHistorikk
  } = useDeferredFetch(fetchHistorikk)

  const seEndringer = () => {
    doFetchHistorikk(deltakerId).then(() => setHistorikkModalOpen(true))
  }

  return (
    <>
      <Button
        className={className ?? ''}
        variant="secondary"
        size="small"
        onClick={seEndringer}
        loading={state === DeferredFetchState.LOADING}
        disabled={state === DeferredFetchState.LOADING}
      >
        Se endringer
      </Button>

      {error && (
        <Alert variant="error" className="mt-4" size="small">
          Beklager, vi kunne ikke hente historiske endringer på tiltaket.
        </Alert>
      )}

      <HistorikkModal
        historikk={historikk}
        tiltakstype={tiltakstype}
        open={historikkModalOpen}
        onClose={() => setHistorikkModalOpen(false)}
      />
    </>
  )
}
