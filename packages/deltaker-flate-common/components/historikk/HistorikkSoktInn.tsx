import { CaretRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyLong, Detail } from '@navikt/ds-react'
import { Tiltakskode } from '../../model/deltaker.ts'
import { Innsok } from '../../model/deltakerHistorikk.ts'
import { formatDate, formatDateWithMonthName } from '../../utils/utils.ts'
import { DeltakelseInnhold } from '../DeltakelseInnhold.tsx'
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
        kodeverk={opplaringKategorisering}
      />

      <Detail className="mt-1" textColor="subtle">
        {utkastGodkjentAvNav
          ? `Søkt inn av ${innsoktAv} ${innsoktAvEnhet} ${formatDate(innsokt)}.`
          : `Utkast delt ${formatDate(utkastDelt)} av ${innsoktAv} ${innsoktAvEnhet}. Du godkjente utkastet ${formatDate(innsokt)}.`}
      </Detail>
    </HistorikkElement>
  )
}
