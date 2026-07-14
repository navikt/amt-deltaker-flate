import { CaretRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyLong, Detail } from '@navikt/ds-react'
import { Tiltakskode } from '../../model/deltaker.ts'
import { Vedtak } from '../../model/deltakerHistorikk'
import { formatDate, formatDateWithMonthName } from '../../utils/utils'
import { DeltakelseInnhold } from '../DeltakelseInnhold.tsx'
import { DeltakelsesmengdeVisning } from '../DeltakelsesmengdeVisning.tsx'
import { HistorikkElement } from './HistorikkElement'

interface Props {
  endringsVedtak: Vedtak
  tiltakskode: Tiltakskode
  erEnkeltplass: boolean
}

export const HistorikkVedtak = ({
  endringsVedtak,
  tiltakskode,
  erEnkeltplass
}: Props) => {
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
      icon={
        <CaretRightCircleFillIcon color="var(--ax-text-meta-lime-decoration)" />
      }
    >
      <DeltakelseInnhold
        tiltakskode={tiltakskode}
        deltakelsesinnhold={deltakelsesinnhold}
        heading={
          <BodyLong size="small" weight="semibold">
            Dette er innholdet
          </BodyLong>
        }
        // TODO kodeverk
        // listClassName="-mt-3 -mb-1" TODO sjekk ut
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

      <DeltakelsesmengdeVisning
        tiltakskode={tiltakskode}
        erEnkeltplass={erEnkeltplass}
        deltakelsesprosent={deltakelsesprosent}
        dagerPerUke={dagerPerUke}
      >
        {(text) => (
          <>
            <BodyLong size="small" weight="semibold" className="mt-2">
              Deltakelsesmengde
            </BodyLong>
            <BodyLong size="small">{text}</BodyLong>
          </>
        )}
      </DeltakelsesmengdeVisning>

      <Detail className="mt-1" textColor="subtle">
        {fattetAvNav
          ? `Meldt på av ${opprettetAv} ${opprettetAvEnhet} ${formatDate(fattet)}.`
          : `Utkast delt ${formatDate(opprettet)} av ${opprettetAv} ${opprettetAvEnhet}. Du godkjente utkastet ${formatDate(fattet)}.`}
      </Detail>
    </HistorikkElement>
  )
}
