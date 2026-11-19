import { ChevronRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Detail, ReadMore } from '@navikt/ds-react'
import type { Tiltakskode } from '../../model/deltaker'
import type { DeltakerHistorikk, Vedtak } from '../../model/deltakerHistorikk'
import { HistorikkType } from '../../model/forslag'
import { formatDate } from '../../utils/utils'
import { DeltakelseInnhold } from '../DeltakelseInnhold'
import { DeltakelsesmengdeBodyLongSection } from '../DeltakelsesmengdeHistorikkVisning'
import { PrisOgBetaling } from '../PrisOgBetaling'
import { HistorikkElement } from './HistorikkElement'

interface Props {
  endringsHistorikk: Extract<
    DeltakerHistorikk,
    { type: HistorikkType.EnkeltplassOkonomiGodkjent }
  >
  tiltakskode: Tiltakskode
}

export const HistorikkOpplaringGodkjent = ({
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

interface VedtaksdetaljerProps {
  vedtak: Vedtak
  tiltakskode: Tiltakskode
}

const EnkeltplassVedtaksdetaljer = ({
  vedtak,
  tiltakskode
}: VedtaksdetaljerProps) => {
  return (
    <>
      <BodyLong size="small" className="mb-2">
        Vedtak fattet {formatDate(vedtak.fattet)}.
      </BodyLong>
      <BodyLong size="small" className="mb-2">
        <span className="font-semibold">Dato:</span>{' '}
        {formatDate(vedtak.startdato)} – {formatDate(vedtak.sluttdato)}
      </BodyLong>
      <DeltakelseInnhold
        tiltakskode={tiltakskode}
        deltakelsesinnhold={vedtak.deltakelsesinnhold}
        opplaringKategoriseringValg={vedtak.opplaringKategorisering}
        heading={
          <BodyLong size="small" weight="semibold">
            Dette er innholdet
          </BodyLong>
        }
      />
      <DeltakelsesmengdeBodyLongSection
        tiltakskode={tiltakskode}
        erEnkeltplass
        deltakelsesprosent={vedtak.deltakelsesprosent}
        dagerPerUke={vedtak.dagerPerUke}
        className="mt-2"
      />
      {vedtak.bakgrunnsinformasjon && (
        <>
          <BodyLong size="small" weight="semibold" className="mt-2">
            Bakgrunnsinfo
          </BodyLong>
          <BodyLong size="small" className="whitespace-pre-wrap">
            {vedtak.bakgrunnsinformasjon}
          </BodyLong>
        </>
      )}
    </>
  )
}
