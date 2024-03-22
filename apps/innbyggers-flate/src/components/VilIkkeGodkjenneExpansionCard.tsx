import { BodyShort, ExpansionCard, Link } from '@navikt/ds-react'
import { ChatElipsisIcon } from '@navikt/aksel-icons'

interface Props {
  className?: string
}
export const VilIkkeGodkjenneExpansionCard = ({ className }: Props) => {
  return (
    <ExpansionCard aria-label="Demo med ikon" className={className || ''}>
      <ExpansionCard.Header>
        <div className="flex gap-4">
          <ChatElipsisIcon aria-hidden fontSize="3rem" />
          <ExpansionCard.Title>
            Ønsker du ikke at dette deles med Muligheter AS?
          </ExpansionCard.Title>
        </div>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <BodyShort>
          Gi beskjed til NAV-veilederen din hvis du ikke ønsker at dette skal deles til arrangøren.
        </BodyShort>
        {/*TODO, vi må få lenken til dialogmelding*/}
        <Link className="mt-2" href="#">
          Send melding til NAV-veilederen din her
        </Link>
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
