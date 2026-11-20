import type { Tiltakskode } from '../../model/deltaker'
import type { DeltakerHistorikk } from '../../model/deltakerHistorikk'
import { HistorikkType } from '../../model/forslag'
import { HistorikkOpplaringGodkjent } from './HistorikkOpplaringGodkjent'
import { HistorikkPrisOgBetalingGodkjent } from './HistorikkPrisOgBetalingGodkjent'

interface Props {
  endringsHistorikk: Extract<
    DeltakerHistorikk,
    { type: HistorikkType.EnkeltplassOkonomiGodkjent }
  >
  tiltakskode: Tiltakskode
}

export const HistorikkEnkeltplassOkonomiGodkjent = ({
  endringsHistorikk,
  tiltakskode
}: Props) => {
  if (endringsHistorikk.erForsteGodkjenning) {
    return (
      <HistorikkOpplaringGodkjent
        endringsHistorikk={endringsHistorikk}
        tiltakskode={tiltakskode}
      />
    )
  }

  return (
    <HistorikkPrisOgBetalingGodkjent endringsHistorikk={endringsHistorikk} />
  )
}
