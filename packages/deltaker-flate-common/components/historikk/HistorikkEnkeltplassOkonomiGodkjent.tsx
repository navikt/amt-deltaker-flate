import { InformationSquareFillIcon } from '@navikt/aksel-icons'
import { BodyShort, Detail } from '@navikt/ds-react'
import { formatDate } from '../../utils/utils'
import { HistorikkElement } from './HistorikkElement'

export const HistorikkEnkeltplassOkonomiGodkjent = ({
  endringsHistorikk
}: {
  endringsHistorikk: {
    type: 'EnkeltplassOkonomiGodkjent'
    endretAv: string
    endretAvEnhet: string
    endret: Date
  }
}) => {
  const { endretAv, endretAvEnhet, endret } = endringsHistorikk

  return (
    <HistorikkElement
      tittel="Opplæring godkjent"
      icon={<InformationSquareFillIcon color="var(--ax-text-on-action)" />}
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
