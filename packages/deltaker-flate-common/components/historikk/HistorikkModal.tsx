import { Alert, Modal } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useDeferredFetch } from '../../hooks/useDeferredFetch'
import {
  DeltakerEndring,
  DeltakerHistorikk,
  Forslag,
  HistorikkType,
  Vedtak
} from '../../model/deltakerHistorikk'
import { HistorikkVedtak } from './HistorikkVedtak'

interface Props {
  deltakerId: string
  open: boolean
  onClose: () => void
  fetchHistorikk: (deltakerId: string) => Promise<DeltakerHistorikk>
}

const getHistorikkItem = (historikk: Vedtak | DeltakerEndring | Forslag) => {
  switch (historikk.type) {
    case HistorikkType.Vedtak:
      return <HistorikkVedtak endringsVedtak={historikk} />
    default:
      return null // TODO lag for alle HistorikkType
  }
}

export const HistorikkModal = ({
  deltakerId,
  open,
  onClose,
  fetchHistorikk
}: Props) => {
  const {
    data: historikk,
    error,
    doFetch: doFetchHistorikk
  } = useDeferredFetch(fetchHistorikk)

  useEffect(() => {
    if (open && !historikk) {
      doFetchHistorikk(deltakerId)
    }
  }, [open, deltakerId])

  if (!historikk) {
    return <div></div>
  }

  return (
    <Modal open={open} header={{ heading: 'Endringer' }} onClose={onClose}>
      <Modal.Body>
        {error && (
          <Alert variant="error">
            Beklager, vi kunne ikke hente historiske endringer på tiltaket.
          </Alert>
        )}
        {historikk &&
          historikk.map((i, index) => (
            <div key={`${i.type}${index}`}>{getHistorikkItem(i)}</div>
          ))}
      </Modal.Body>
    </Modal>
  )
}
