import { ChevronRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyShort, Detail } from '@navikt/ds-react'
import type { DeltakerHistorikk } from '../../model/deltakerHistorikk'
import { HistorikkType } from '../../model/forslag'
import { formatDate } from '../../utils/utils'
import { HistorikkElement } from './HistorikkElement'

interface Props {
  endringsHistorikk: Extract<
    DeltakerHistorikk,
    { type: HistorikkType.EnkeltplassOkonomiGodkjent }
  >
}

export const HistorikkEnkeltplassOkonomiGodkjent = ({
  endringsHistorikk
}: Props) => {
  const { endretAv, endretAvEnhet, endret } = endringsHistorikk

  return (
    <HistorikkElement
      tittel="Opplæring godkjent"
      icon={
        <ChevronRightCircleFillIcon color="var(--ax-text-accent-decoration)" />
      }
    >
      <BodyShort size="small">
        Pris og betalingsbetingelser er godkjent, og vedtak er fattet.
      </BodyShort>

      <Detail className="mt-2" textColor="subtle">
        {`Endret ${formatDate(endret)} av ${endretAv} ${endretAvEnhet}.`}
      </Detail>
    </HistorikkElement>
  )
}
