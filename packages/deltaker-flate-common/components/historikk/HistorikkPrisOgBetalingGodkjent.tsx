import { MenuElipsisHorizontalCircleFillIcon } from '@navikt/aksel-icons'
import { Detail, ReadMore, Tag } from '@navikt/ds-react'
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

export const HistorikkPrisOgBetalingGodkjent = ({
  endringsHistorikk
}: Props) => {
  const { endretAv, endretAvEnhet, endret, prisinformasjon } = endringsHistorikk

  return (
    <HistorikkElement
      tittel="Godkjent: Endre pris og betalingsbetingelser"
      icon={
        <MenuElipsisHorizontalCircleFillIcon
          aria-hidden
          color="var(--ax-text-info-decoration)"
        />
      }
      badge={
        <Tag variant="outline" data-color="success" size="small">
          Godkjent
        </Tag>
      }
    >
      <Detail textColor="subtle">
        {`Endret ${formatDate(endret)}${endretAv ? ` av ${endretAv}` : ''}${endretAvEnhet ? ` ${endretAvEnhet}` : ''}.`}
      </Detail>

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
    </HistorikkElement>
  )
}
