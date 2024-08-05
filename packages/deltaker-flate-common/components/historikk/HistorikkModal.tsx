import { Alert, Modal } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useDeferredFetch } from '../../hooks/useDeferredFetch'
import {
  DeltakerHistorikk,
  DeltakerHistorikkListe,
  HistorikkType
} from '../../model/deltakerHistorikk'
import { HistorikkVedtak } from './HistorikkVedtak'

interface Props {
  deltakerId: string
  open: boolean
  onClose: () => void
  fetchHistorikk: (deltakerId: string) => Promise<DeltakerHistorikkListe>
}

const getHistorikkItem = (historikk: DeltakerHistorikk) => {
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
            <div key={`${i.type}${index}`} className="mb-6 last:mb-0">
              {getHistorikkItem(i)}
            </div>
          ))}
      </Modal.Body>
    </Modal>
  )
}
