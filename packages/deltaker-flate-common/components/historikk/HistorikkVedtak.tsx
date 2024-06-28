import { CaretRightCircleFillIcon } from '@navikt/aksel-icons'
import { BodyLong, Heading } from '@navikt/ds-react'
import { Vedtak } from '../../model/deltakerHistorikk'
import { formatDate } from '../../utils/utils'
import { DeltakelseInnholdListe } from '../DeltakelseInnholdListe'

interface Props {
  endringsVedtak: Vedtak
}

export const HistorikkVedtak = ({ endringsVedtak }: Props) => {
  const {
    fattet,
    fattetAvNav,
    opprettetAv,
    opprettetAvEnhet,
    deltakelsesinnhold,
    bakgrunnsinformasjon
  } = endringsVedtak

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.5rem auto',
        gap: '0.5rem'
      }}
    >
      <CaretRightCircleFillIcon
        fontSize="1.5rem"
        aria-hidden
        color="var(--a-limegreen-800)"
        style={{ marginRight: '0.5rem' }}
      />
      <div>
        <Heading level="2" size="medium">
          Pamelding {formatDate(fattet)}
        </Heading>

        <Heading level="3" size="small" className="mt-4">
          Dette er innholdet
        </Heading>
        <BodyLong size="small" className="mt-2">
          {deltakelsesinnhold.ledetekst}
        </BodyLong>
        <DeltakelseInnholdListe deltakelsesinnhold={deltakelsesinnhold} />

        <Heading level="3" size="small" className="mt-4">
          Bakgrunnsinfo
        </Heading>
        <BodyLong size="small" className="mt-2">
          {bakgrunnsinformasjon}
        </BodyLong>

        <BodyLong size="small" textColor="subtle" className="mt-4">
          {fattetAvNav
            ? `Meldt på av ${opprettetAv} ${opprettetAvEnhet} ${formatDate(fattet)}.`
            : `Utkast delt av ${opprettetAv} ${opprettetAvEnhet}. Du godkjente utkastet ${formatDate(fattet)}.`}
        </BodyLong>
      </div>
    </div>
  )
}
