import { ChevronRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyShort, Detail } from '@navikt/ds-react'
import type { DeltakerHistorikk } from '../../model/deltakerHistorikk'
import { HistorikkType } from '../../model/forslag'
import { formatDate } from '../../utils/utils'
import { PrisOgBetaling } from '../PrisOgBetaling'
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
  const {
    endretAv,
    endretAvEnhet,
    endret,
    erForsteGodkjenning,
    prisinformasjon
  } = endringsHistorikk

  return (
    <HistorikkElement
      tittel={
        erForsteGodkjenning
          ? 'Opplæring godkjent'
          : 'Godkjent: Endre pris og betalingsbetingelser'
      }
      icon={
        <ChevronRightCircleFillIcon color="var(--ax-text-accent-decoration)" />
      }
    >
      {erForsteGodkjenning ? (
        <BodyShort size="small">
          Pris og betalingsbetingelser er godkjent, og vedtak er fattet.
        </BodyShort>
      ) : (
        <PrisOgBetaling
          prisinformasjon={prisinformasjon}
          headinglevel="3"
          showHeading={false}
          compact
          showTilleggsstonaderInfo={false}
        />
      )}

      <Detail className="mt-2" textColor="subtle">
        {endretAv === null
          ? null
          : `Endret ${formatDate(endret)} av ${endretAv}${endretAvEnhet ? ` ${endretAvEnhet}` : ''}.`}
      </Detail>
    </HistorikkElement>
  )
}
