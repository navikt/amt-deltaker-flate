import { BodyShort, Heading, LinkPanel } from '@navikt/ds-react'
import { Todo } from '../Todo.tsx'
import { EndreDeltakelseKnapp } from './EndreDeltakelseKnapp.tsx'
import { hentTiltakNavnHosArrangørTekst } from '../../utils/displayText.ts'
import { usePameldingCOntext } from './PameldingContext.tsx'

export const ForNAVAnsatt = () => {
  const { pamelding } = usePameldingCOntext()
  return (
    <div className="bg-white p-4 h-fit w-fit xl:grow">
      <Heading level="2" size="medium" className="mb-4 ">
        For NAV-ansatt
      </Heading>
      <EndreDeltakelseKnapp />

      <LinkPanel
        href="#"
        border
        className="mt-4 rounded border-2 border-[var(--a-border-selected)]"
        size="small"
      >
        <LinkPanel.Title className="text-lg text-[var(--a-text-action)] text-nowrap">
          Gå til tiltaksgjennomføringen
        </LinkPanel.Title>
        <LinkPanel.Description>
          <BodyShort size="small">
            {hentTiltakNavnHosArrangørTekst(
              pamelding.deltakerliste.tiltakstype,
              pamelding.deltakerliste.arrangorNavn
            )}
          </BodyShort>
          <BodyShort size="small">
            <Todo /> Sted
          </BodyShort>
          <BodyShort size="small">
            <Todo /> Start slutt
          </BodyShort>
        </LinkPanel.Description>
      </LinkPanel>
    </div>
  )
}
