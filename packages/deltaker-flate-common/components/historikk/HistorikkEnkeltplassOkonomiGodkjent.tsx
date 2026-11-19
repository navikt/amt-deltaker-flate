import {
  ChevronRightCircleFillIcon,
  MenuElipsisHorizontalCircleFillIcon
} from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Detail, ReadMore, Tag } from '@navikt/ds-react'
import type { Tiltakskode } from '../../model/deltaker'
import type { DeltakerHistorikk } from '../../model/deltakerHistorikk'
import { HistorikkType } from '../../model/forslag'
import { formatDate } from '../../utils/utils'
import { PrisOgBetaling } from '../PrisOgBetaling'
import { EnkeltplassVedtaksdetaljer } from './EnkeltplassVedtaksdetaljer'
import { HistorikkElement } from './HistorikkElement'

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

const HistorikkOpplaringGodkjent = ({
  endringsHistorikk,
  tiltakskode
}: Props) => {
  const { endretAv, endretAvEnhet, endret, prisinformasjon, vedtaksdetaljer } =
    endringsHistorikk

  return (
    <HistorikkElement
      tittel="Opplæring godkjent"
      icon={
        <ChevronRightCircleFillIcon
          aria-hidden
          color="var(--ax-text-accent-decoration)"
        />
      }
    >
      <BodyShort size="small" className="mb-2">
        Pris og betalingsbetingelser er godkjent, og vedtak er fattet.
      </BodyShort>

      <Detail textColor="subtle">
        {`Endret ${formatDate(endret)}${endretAv ? ` av ${endretAv}` : ''}${endretAvEnhet ? ` ${endretAvEnhet}` : ''}.`}
      </Detail>

      <ReadMore
        variant="moderate"
        size="small"
        className="mt-2"
        header="Søknaden som ble godkjent"
      >
        {vedtaksdetaljer ? (
          <EnkeltplassVedtaksdetaljer
            vedtak={vedtaksdetaljer}
            tiltakskode={tiltakskode}
          />
        ) : (
          <BodyLong size="small">
            Detaljene i vedtaket er ikke tilgjengelige for denne godkjenningen.
          </BodyLong>
        )}
        <BodyLong size="small" weight="semibold" className="mt-2">
          Pris og betalingsbetingelser
        </BodyLong>
        {!prisinformasjon && (
          <BodyLong size="small">
            Historisk prisinformasjon er ikke tilgjengelig for denne
            godkjenningen.
          </BodyLong>
        )}
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

const HistorikkPrisOgBetalingGodkjent = ({
  endringsHistorikk
}: Pick<Props, 'endringsHistorikk'>) => {
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
