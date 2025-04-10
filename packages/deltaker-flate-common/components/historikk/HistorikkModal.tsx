import { Alert, Modal } from '@navikt/ds-react'
import { ArenaTiltakskode } from '../../model/deltaker'
import {
  DeltakerHistorikk,
  DeltakerHistorikkListe
} from '../../model/deltakerHistorikk'
import { HistorikkType } from '../../model/forslag'
import { HistorikkArrangorEndring } from './HistorikkArrangorEndring'
import { HistorikkEndring } from './HistorikkEndring'
import { HistorikkForslag } from './HistorikkForslag'
import { HistorikkImportertFraArena } from './HistorikkImportertFraArena'
import { HistorikkVedtak } from './HistorikkVedtak'
import { HistorikkSkeleton } from './HistorikkSkeleton'
import { HistorikkVurderingFraArrangor } from './HistorikkVurderingFraArrangor.tsx'
import { HistorikkSoktInn } from './HistorikkSoktInn.tsx'
import { HistorikkTiltakskoordinatorEndring } from './HistorikkTiltakskoordinatorEndring.tsx'

interface Props {
  historikk: DeltakerHistorikkListe | null
  tiltakstype: ArenaTiltakskode
  open: boolean
  loading: boolean
  onClose: () => void
}

const getHistorikkItem = (
  historikk: DeltakerHistorikk,
  tiltakstype: ArenaTiltakskode
) => {
  switch (historikk.type) {
    case HistorikkType.Vedtak:
      return (
        <HistorikkVedtak endringsVedtak={historikk} tiltakstype={tiltakstype} />
      )
    case HistorikkType.InnsokPaaFellesOppstart:
      return (
        <HistorikkSoktInn
          soktInnHistorikk={historikk}
          tiltakstype={tiltakstype}
        />
      )
    case HistorikkType.Endring:
      return (
        <HistorikkEndring
          deltakerEndring={historikk}
          tiltakstype={tiltakstype}
        />
      )
    case HistorikkType.Forslag:
      return <HistorikkForslag forslag={historikk} />
    case HistorikkType.EndringFraArrangor:
      return <HistorikkArrangorEndring deltakerEndringFraArrangor={historikk} />
    case HistorikkType.ImportertFraArena:
      return (
        <HistorikkImportertFraArena
          deltakelseVedImport={historikk}
          tiltakstype={tiltakstype}
        />
      )
    case HistorikkType.VurderingFraArrangor:
      return <HistorikkVurderingFraArrangor vurdering={historikk} />
    case HistorikkType.EndringFraTiltakskoordinator:
      return (
        <HistorikkTiltakskoordinatorEndring
          tiltakskoordinatorEndring={historikk}
        />
      )
  }
}

export const HistorikkModal = ({
  open,
  loading,
  historikk,
  tiltakstype,
  onClose
}: Props) => {
  return (
    <Modal
      open={open}
      placement="top"
      header={{ heading: 'Endringer' }}
      onClose={onClose}
      className="w-full"
    >
      <Modal.Body>
        {loading && <HistorikkSkeleton />}
        {!loading &&
          historikk &&
          historikk.map((i, index) => (
            <div key={`${i.type}${index}`} className="mb-6 last:mb-0">
              {getHistorikkItem(i, tiltakstype)}
            </div>
          ))}
        {!loading && (!historikk || historikk.length < 0) && (
          <Alert variant="info" size="small">
            Ingen historikk å vise.
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  )
}
