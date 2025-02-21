import { CaretRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyLong, Detail } from '@navikt/ds-react'
import { ArenaTiltakskode } from '../../model/deltaker.ts'
import { Vedtak } from '../../model/deltakerHistorikk'
import { deltakerprosentText } from '../../utils/displayText'
import {
  formatDate,
  formatDateWithMonthName,
  visDeltakelsesmengde
} from '../../utils/utils'
import { DeltakelseInnhold } from '../DeltakelseInnhold.tsx'
import { HistorikkElement } from './HistorikkElement'

interface Props {
  endringsVedtak: Vedtak
  tiltakstype: ArenaTiltakskode
}

export const HistorikkVedtak = ({ endringsVedtak, tiltakstype }: Props) => {
  const {
    fattet,
    fattetAvNav,
    opprettet,
    opprettetAv,
    opprettetAvEnhet,
    dagerPerUke,
    deltakelsesprosent,
    deltakelsesinnhold,
    bakgrunnsinformasjon
  } = endringsVedtak

  return (
    <HistorikkElement
      tittel={`Påmelding ${formatDateWithMonthName(fattet)}`}
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

      {bakgrunnsinformasjon && bakgrunnsinformasjon.length > 0 && (
        <>
          <BodyLong size="small" weight="semibold" className="mt-2">
            Bakgrunnsinfo
          </BodyLong>
          <BodyLong size="small" className=" whitespace-pre-wrap">
            {bakgrunnsinformasjon}
          </BodyLong>
        </>
      )}

      {visDeltakelsesmengde(tiltakstype) && (
        <>
          <BodyLong size="small" weight="semibold" className="mt-2">
            Deltakelsesmengde
          </BodyLong>
          <BodyLong size="small">
            {deltakerprosentText(deltakelsesprosent, dagerPerUke)}
          </BodyLong>
        </>
      )}

      <Detail className="mt-1" textColor="subtle">
        {fattetAvNav
          ? `Meldt på av ${opprettetAv} ${opprettetAvEnhet} ${formatDate(fattet)}.`
          : `Utkast delt ${formatDate(opprettet)} av ${opprettetAv} ${opprettetAvEnhet}. Du godkjente utkastet ${formatDate(fattet)}.`}
      </Detail>
    </HistorikkElement>
  )
}
