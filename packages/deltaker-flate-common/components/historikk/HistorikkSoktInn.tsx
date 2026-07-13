import { CaretRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyLong, Detail } from '@navikt/ds-react'
import { Tiltakskode } from '../../model/deltaker.ts'
import { Innsok } from '../../model/deltakerHistorikk.ts'
import { deltakerprosentText } from '../../utils/displayText.ts'
import {
  formatDate,
  formatDateWithMonthName,
  harDeltakelsesmengde
} from '../../utils/utils.ts'
import { DeltakelseInnhold } from '../DeltakelseInnhold.tsx'
import { PrisOgBetaling } from '../PrisOgBetaling.tsx'
import { HistorikkElement } from './HistorikkElement.tsx'

interface Props {
  soktInnHistorikk: Innsok
  tiltakskode: Tiltakskode
  erEnkeltplass: boolean
}

export const HistorikkSoktInn = ({
  soktInnHistorikk,
  tiltakskode,
  erEnkeltplass
}: Props) => {
  const {
    innsokt,
    innsoktAv,
    innsoktAvEnhet,
    startdato,
    sluttdato,
    deltakelsesinnholdVedInnsok,
    dagerPerUkeVedInnsok,
    prisinformasjonVedInnsok,
    opplaringKategorisering,
    utkastDelt,
    utkastGodkjentAvNav
  } = soktInnHistorikk
  const datoText = `${formatDate(startdato)} ${sluttdato ? '– ' + formatDate(sluttdato) : '—'}`

  return (
    <HistorikkElement
      tittel={`Søknad om plass ${formatDateWithMonthName(innsokt)}`}
      icon={
        <CaretRightCircleFillIcon color="var(--ax-text-meta-lime-decoration)" />
      }
    >
      <BodyLong size="small" className="mb-2">
        <span className="font-semibold">Dato:</span> {datoText}
      </BodyLong>
      <DeltakelseInnhold
        tiltakskode={tiltakskode}
        deltakelsesinnhold={deltakelsesinnholdVedInnsok}
        heading={
          <BodyLong size="small" weight="semibold">
            Dette er innholdet
          </BodyLong>
        }
        opplaringKategoriseringValg={opplaringKategorisering}
      />

      {erEnkeltplass &&
        harDeltakelsesmengde({ tiltakskode, erEnkeltplass }) &&
        dagerPerUkeVedInnsok != null && (
          <>
            <BodyLong size="small" weight="semibold" className="mt-4">
              Deltakelsesmengde
            </BodyLong>
            <BodyLong size="small">
              {deltakerprosentText(null, dagerPerUkeVedInnsok, erEnkeltplass)}
            </BodyLong>
          </>
        )}

      {prisinformasjonVedInnsok && (
        <>
          <BodyLong size="small" weight="semibold" className="mt-4">
            Pris og betalingsbetingelser
          </BodyLong>

          <PrisOgBetaling
            prisinformasjon={prisinformasjonVedInnsok}
            headinglevel="3"
            showHeading={false}
            showTilleggsstonaderInfo={false}
          />
        </>
      )}

      <Detail className="mt-1" textColor="subtle">
        {utkastGodkjentAvNav
          ? `Søkt inn av ${innsoktAv} ${innsoktAvEnhet} ${formatDate(innsokt)}.`
          : `Utkast delt ${formatDate(utkastDelt)} av ${innsoktAv} ${innsoktAvEnhet}. Du godkjente utkastet ${formatDate(innsokt)}.`}
      </Detail>
    </HistorikkElement>
  )
}
