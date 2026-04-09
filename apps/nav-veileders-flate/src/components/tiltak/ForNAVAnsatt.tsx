import { Alert, BodyShort, Detail, Heading, LinkCard } from '@navikt/ds-react'
import {
  formatDate,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import {
  TILTAKSGJENNOMFORING_LINK,
  useModiaLink
} from '../../hooks/useModiaLink.ts'
import { getEndreDeltakelsesValg } from '../../utils/endreDeltakelse.ts'
import {
  DeltakerlisteStatusTag,
  visDeltakerlisteStatus
} from './DeltakerlisteStatusTag.tsx'
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
    <div
      className={`bg-(--ax-bg-default) p-4 h-fit ${className} flex flex-col`}
    >
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

      {!pamelding.deltakerliste.erEnkeltplass && (
        <LinkCard
          onClick={(event) => {
            event.preventDefault()
            doRedirect(`${TILTAKSGJENNOMFORING_LINK}/${deltakerlisteId}`)
          }}
          className="mt-4 ax-xl:max-w-125"
          data-color="accent"
        >
          <LinkCard.Title>
            <LinkCard.Anchor
              href={`${TILTAKSGJENNOMFORING_LINK}/${deltakerlisteId}`}
            >
              Gå til tiltaks&shy;gjennomføringen
            </LinkCard.Anchor>
          </LinkCard.Title>
          <LinkCard.Description>
            <BodyShort size="small">
              {hentTiltakNavnHosArrangorTekst(
                pamelding.deltakerliste.tiltakskode,
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
          </LinkCard.Description>

          {visDeltakerlisteStatus(pamelding.deltakerliste.status) && (
            <LinkCard.Footer>
              <DeltakerlisteStatusTag status={pamelding.deltakerliste.status} />
            </LinkCard.Footer>
          )}
        </LinkCard>
      )}
    </div>
  )
}
