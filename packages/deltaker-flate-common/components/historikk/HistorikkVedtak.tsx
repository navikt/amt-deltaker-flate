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
      className="grid gap-2"
      style={{
        gridTemplateColumns: '1.25rem auto'
      }}
    >
      <CaretRightCircleFillIcon
        fontSize="1.25rem"
        aria-hidden
        color="var(--a-limegreen-800)"
        className="mt-3"
      />
      <div className="pt-2">
        <Heading level="2" size="small">
          Påmelding {formatDate(fattet)}
        </Heading>

        <BodyLong size="small" weight="semibold" className="mt-1">
          Dette er innholdet
        </BodyLong>
        <BodyLong size="small">{deltakelsesinnhold.ledetekst}</BodyLong>
        <DeltakelseInnholdListe
          deltakelsesinnhold={deltakelsesinnhold}
          className="-mt-3 -mb-1"
        />

        <BodyLong size="small" weight="semibold" className="mt-2">
          Bakgrunnsinfo
        </BodyLong>
        <BodyLong size="small">{bakgrunnsinformasjon}</BodyLong>

        <BodyLong size="small" textColor="subtle" className="mt-1">
          {fattetAvNav
            ? `Meldt på av ${opprettetAv} ${opprettetAvEnhet} ${formatDate(fattet)}.`
            : `Utkast delt av ${opprettetAv} ${opprettetAvEnhet}. Du godkjente utkastet ${formatDate(fattet)}.`}
        </BodyLong>
      </div>
    </div>
  )
}
