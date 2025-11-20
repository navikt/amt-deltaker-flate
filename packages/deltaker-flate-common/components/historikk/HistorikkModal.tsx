import { Alert, Modal } from '@navikt/ds-react'
import { Tiltakskode } from '../../model/deltaker'
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
  tiltakskode: Tiltakskode
  open: boolean
  loading: boolean
  onClose: () => void
}

const getHistorikkItem = (
  historikk: DeltakerHistorikk,
  tiltakskode: Tiltakskode
) => {
  switch (historikk.type) {
    case HistorikkType.Vedtak:
      return (
        <HistorikkVedtak endringsVedtak={historikk} tiltakskode={tiltakskode} />
      )
    case HistorikkType.InnsokPaaFellesOppstart:
      return (
        <HistorikkSoktInn
          soktInnHistorikk={historikk}
          tiltakskode={tiltakskode}
        />
      )
    case HistorikkType.Endring:
      return (
        <HistorikkEndring
          deltakerEndring={historikk}
          tiltakskode={tiltakskode}
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
          tiltakskode={tiltakskode}
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
  tiltakskode,
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
              {getHistorikkItem(i, tiltakskode)}
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
