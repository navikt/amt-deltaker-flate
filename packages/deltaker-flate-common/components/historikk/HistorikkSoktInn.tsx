import { CaretRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyLong, Detail } from '@navikt/ds-react'
import { ArenaTiltakskode } from '../../model/deltaker.ts'
import { InnsokPaaFellesOppstart } from '../../model/deltakerHistorikk.ts'
import { formatDate, formatDateWithMonthName } from '../../utils/utils.ts'
import { DeltakelseInnhold } from '../DeltakelseInnhold.tsx'
import { HistorikkElement } from './HistorikkElement.tsx'

interface Props {
  soktInnHistorikk: InnsokPaaFellesOppstart
  tiltakstype: ArenaTiltakskode
}

export const HistorikkSoktInn = ({ soktInnHistorikk, tiltakstype }: Props) => {
  const {
    innsokt,
    innsoktAv,
    innsoktAvEnhet,
    deltakelsesinnholdVedInnsok,
    utkastDelt,
    utkastGodkjentAvNav
  } = soktInnHistorikk

  return (
    <HistorikkElement
      tittel={`Søknad om plass ${formatDateWithMonthName(innsokt)}`}
      icon={<CaretRightCircleFillIcon color="var(--a-limegreen-800)" />}
    >
      <DeltakelseInnhold
        tiltakstype={tiltakstype}
        deltakelsesinnhold={deltakelsesinnholdVedInnsok}
        heading={
          <BodyLong size="small" weight="semibold">
            Dette er innholdet
          </BodyLong>
        }
        listClassName="-mt-3 -mb-1"
      />

      <Detail className="mt-1" textColor="subtle">
        {utkastGodkjentAvNav
          ? `Søkt inn av ${innsoktAv} ${innsoktAvEnhet} ${formatDate(innsokt)}.`
          : `Utkast delt ${formatDate(utkastDelt)} av ${innsoktAv} ${innsoktAvEnhet}. Du godkjente utkastet ${formatDate(innsokt)}.`}
      </Detail>
    </HistorikkElement>
  )
}
