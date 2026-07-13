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
}

export const HistorikkSoktInn = ({ soktInnHistorikk, tiltakskode }: Props) => {
  const {
    innsokt,
    innsoktAv,
    innsoktAvEnhet,
    deltakelsesinnholdVedInnsok,
    dagerPerUkeVedInnsok,
    prisinformasjonVedInnsok,
    opplaringKategorisering,
    utkastDelt,
    utkastGodkjentAvNav
  } = soktInnHistorikk

  return (
    <HistorikkElement
      tittel={`Søknad om plass ${formatDateWithMonthName(innsokt)}`}
      icon={
        <CaretRightCircleFillIcon color="var(--ax-text-meta-lime-decoration)" />
      }
    >
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

      {harDeltakelsesmengde({ tiltakskode, erEnkeltplass: true }) &&
        dagerPerUkeVedInnsok != null && (
          <>
            <BodyLong size="small" weight="semibold" className="mt-4">
              Deltakelsesmengde
            </BodyLong>
            <BodyLong size="small">
              {deltakerprosentText(null, dagerPerUkeVedInnsok, true)}
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
