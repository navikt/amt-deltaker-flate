import { CaretRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyLong, Detail } from '@navikt/ds-react'
import { ArenaTiltakskode } from '../../model/deltaker.ts'
import { SoktInn } from '../../model/deltakerHistorikk.ts'
import { formatDate, formatDateWithMonthName } from '../../utils/utils.ts'
import { DeltakelseInnhold } from '../DeltakelseInnhold.tsx'
import { HistorikkElement } from './HistorikkElement.tsx'

interface Props {
  soktInnHistorikk: SoktInn
  tiltakstype: ArenaTiltakskode
}

export const HistorikkSoktInn = ({ soktInnHistorikk, tiltakstype }: Props) => {
  const {
    soktInn,
    soktInnAvNav,
    opprettet,
    opprettetAv,
    opprettetAvEnhet,
    deltakelsesinnhold
  } = soktInnHistorikk

  return (
    <HistorikkElement
      tittel={`Søknad om plass ${formatDateWithMonthName(soktInn)}`}
      icon={<CaretRightCircleFillIcon color="var(--a-limegreen-800)" />}
    >
      <DeltakelseInnhold
        tiltakstype={tiltakstype}
        deltakelsesinnhold={deltakelsesinnhold}
        heading={
          <BodyLong size="small" weight="semibold">
            Dette er innholdet
          </BodyLong>
        }
        listClassName="-mt-3 -mb-1"
      />

      <Detail className="mt-1" textColor="subtle">
        {soktInnAvNav
          ? `Søkt inn av ${opprettetAv} ${opprettetAvEnhet} ${formatDate(soktInn)}.`
          : `Utkast delt ${formatDate(opprettet)} av ${opprettetAv} ${opprettetAvEnhet}. Du godkjente utkastet ${formatDate(soktInn)}.`}
      </Detail>
    </HistorikkElement>
  )
}
