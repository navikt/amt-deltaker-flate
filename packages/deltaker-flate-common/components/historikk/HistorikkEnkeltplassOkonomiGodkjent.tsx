import {
  ChevronRightCircleFillIcon,
  MenuElipsisHorizontalCircleFillIcon
} from '@navikt/aksel-icons'
import { BodyShort, Detail, ReadMore, Tag } from '@navikt/ds-react'
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
        erForsteGodkjenning ? (
          <ChevronRightCircleFillIcon
            aria-hidden
            color="var(--ax-text-accent-decoration)"
          />
        ) : (
          <MenuElipsisHorizontalCircleFillIcon
            aria-hidden
            color="var(--ax-text-info-decoration)"
          />
        )
      }
      badge={
        !erForsteGodkjenning ? (
          <Tag variant="outline" data-color="success" size="small">
            Godkjent
          </Tag>
        ) : undefined
      }
    >
      {erForsteGodkjenning && (
        <BodyShort size="small" className="mb-2">
          Pris og betalingsbetingelser er godkjent, og vedtak er fattet.
        </BodyShort>
      )}

      <Detail textColor="subtle">
        {`Endret ${formatDate(endret)}${endretAv ? ` av ${endretAv}` : ''}${endretAvEnhet ? ` ${endretAvEnhet}` : ''}.`}
      </Detail>

      {!erForsteGodkjenning && (
        <ReadMore
          variant="moderate"
          size="small"
          className="mt-2"
          header="Endringen som ble godkjent"
        >
          <PrisOgBetaling
            prisinformasjon={prisinformasjon}
            headinglevel="3"
            showHeading={false}
            compact
            visTilleggsstonaderInfo={false}
          />
        </ReadMore>
      )}
    </HistorikkElement>
  )
}
