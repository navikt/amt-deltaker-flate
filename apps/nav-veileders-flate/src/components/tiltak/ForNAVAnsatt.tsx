import { BodyShort, Heading, LinkPanel } from '@navikt/ds-react'
import { EndreDeltakelseKnapp } from './EndreDeltakelseKnapp.tsx'
import { hentTiltakNavnHosArrangorTekst } from '../../utils/displayText.ts'
import { usePameldingCOntext } from './PameldingContext.tsx'
import { formatDateFromString } from '../../utils/utils.ts'
import { TILTAKSGJENNOMFORING_LINK, useModiaLink } from '../../hooks/useModiaLink.ts'

interface Props {
  className: string
}

export const ForNAVAnsatt = ({ className }: Props) => {
  const { pamelding } = usePameldingCOntext()
  const deltakerlisteId = pamelding.deltakerliste.deltakerlisteId
  const { doRedirect } = useModiaLink()

  return (
    <div className={`bg-white p-4 h-fit ${className} flex flex-col`}>
      <Heading level="2" size="medium" className="mb-4 ">
        For NAV-ansatt
      </Heading>
      <EndreDeltakelseKnapp />

      <LinkPanel
        href={`${TILTAKSGJENNOMFORING_LINK}/${deltakerlisteId}`}
        onClick={(event) => {
          event.preventDefault()
          doRedirect(`${TILTAKSGJENNOMFORING_LINK}/${deltakerlisteId}`)
        }}
        border
        className="mt-4 rounded border-2 border-[var(--a-border-selected)] xl:max-w-[500px]"
      >
        <LinkPanel.Title className="text-lg text-[var(--a-text-action)] text-nowrap">
          Gå til tiltaksgjennomføringen
        </LinkPanel.Title>
        <LinkPanel.Description>
          <BodyShort size="small">
            {hentTiltakNavnHosArrangorTekst(
              pamelding.deltakerliste.tiltakstype,
              pamelding.deltakerliste.arrangorNavn
            )}
          </BodyShort>
          <BodyShort size="small">
            {formatDateFromString(pamelding.deltakerliste.startdato)} -{' '}
            {formatDateFromString(pamelding.deltakerliste.sluttdato)}
          </BodyShort>
        </LinkPanel.Description>
      </LinkPanel>
    </div>
  )
}
