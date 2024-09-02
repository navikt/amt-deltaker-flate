import { Alert, Modal } from '@navikt/ds-react'
import {
  DeltakerHistorikk,
  DeltakerHistorikkListe
} from '../../model/deltakerHistorikk'
import { HistorikkType } from '../../model/forslag'
import { HistorikkEndring } from './HistorikkEndring'
import { HistorikkForslag } from './HistorikkForslag'
import { HistorikkVedtak } from './HistorikkVedtak'
import { HistorikkArrangorEndring } from './HistorikkArrangorEndring'
import { Tiltakstype } from '../../model/deltaker'

interface Props {
  historikk: DeltakerHistorikkListe | null
  tiltakstype: Tiltakstype
  open: boolean
  onClose: () => void
}

const getHistorikkItem = (
  historikk: DeltakerHistorikk,
  tiltakstype: Tiltakstype
) => {
  switch (historikk.type) {
    case HistorikkType.Vedtak:
      return (
        <HistorikkVedtak endringsVedtak={historikk} tiltakstype={tiltakstype} />
      )
    case HistorikkType.Endring:
      return <HistorikkEndring deltakerEndring={historikk} />
    case HistorikkType.Forslag:
      return <HistorikkForslag forslag={historikk} />
    case HistorikkType.EndringFraArrangor:
      return <HistorikkArrangorEndring deltakerEndringFraArrangor={historikk} />
  }
}

export const HistorikkModal = ({
  open,
  historikk,
  tiltakstype,
  onClose
}: Props) => {
  return (
    <Modal open={open} header={{ heading: 'Endringer' }} onClose={onClose}>
      <Modal.Body>
        {historikk &&
          historikk.map((i, index) => (
            <div key={`${i.type}${index}`} className="mb-6 last:mb-0">
              {getHistorikkItem(i, tiltakstype)}
            </div>
          ))}
        {(!historikk || historikk.length < 0) && (
          <Alert variant="info" size="small">
            Ingen historikk å vise.
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  )
}
