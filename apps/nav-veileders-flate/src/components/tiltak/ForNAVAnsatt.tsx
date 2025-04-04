import { Alert, BodyShort, Detail, Heading, LinkPanel } from '@navikt/ds-react'
import {
  formatDate,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import {
  TILTAKSGJENNOMFORING_LINK,
  useModiaLink
} from '../../hooks/useModiaLink.ts'
import { getEndreDeltakelsesValg } from '../../utils/endreDeltakelse.ts'
import { DeltakerlisteStatusTag } from './DeltakerlisteStatusTag.tsx'
import { EndreDeltakelseKnapp } from './EndreDeltakelseKnapp.tsx'
import { usePameldingContext } from './PameldingContext.tsx'

interface Props {
  className: string
}

export const ForNAVAnsatt = ({ className }: Props) => {
  const { pamelding } = usePameldingContext()
  const deltakerlisteId = pamelding.deltakerliste.deltakerlisteId
  const { doRedirect } = useModiaLink()
  const kanEndres =
    pamelding.kanEndres && getEndreDeltakelsesValg(pamelding).length > 0

  return (
    <div className={`bg-white p-4 h-fit ${className} flex flex-col`}>
      <Heading level="2" size="medium" className="mb-4 ">
        For Nav-ansatt
      </Heading>
      {kanEndres ? (
        <EndreDeltakelseKnapp />
      ) : (
        <Alert inline variant="info">
          Deltakelsen kan ikke endres
        </Alert>
      )}

      <LinkPanel
        href={`${TILTAKSGJENNOMFORING_LINK}/${deltakerlisteId}`}
        onClick={(event) => {
          event.preventDefault()
          doRedirect(`${TILTAKSGJENNOMFORING_LINK}/${deltakerlisteId}`)
        }}
        border
        className="mt-4 rounded-sm border-2 border-[var(--a-border-selected)] xl:max-w-[500px]"
      >
        <LinkPanel.Title className="text-lg text-[var(--a-text-action)] text-nowrap">
          Gå til tiltaks&shy;gjennomføringen
        </LinkPanel.Title>
        <LinkPanel.Description>
          <BodyShort size="small">
            {hentTiltakNavnHosArrangorTekst(
              pamelding.deltakerliste.tiltakstype,
              pamelding.deltakerliste.arrangorNavn
            )}
          </BodyShort>
          <Detail textColor="subtle" className="mb-1">
            {pamelding.deltakerliste.deltakerlisteNavn}
          </Detail>
          <BodyShort size="small">
            {formatDate(pamelding.deltakerliste.startdato)} -{' '}
            {formatDate(pamelding.deltakerliste.sluttdato)}
          </BodyShort>
          <DeltakerlisteStatusTag status={pamelding.deltakerliste.status} />
        </LinkPanel.Description>
      </LinkPanel>
    </div>
  )
}
