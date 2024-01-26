import { Heading, LinkPanel } from '@navikt/ds-react'
import { Todo } from '../Todo.tsx'
import { EndreDeltakelseKnapp } from './EndreDeltakelseKnapp.tsx'

export const ForNAVAnsatt = () => {
  return (
    <div className="bg-white p-4 h-fit">
      <Heading level="2" size="medium" className="mb-4 ">
        For NAV-ansatt
      </Heading>
      <EndreDeltakelseKnapp />

      <LinkPanel href="#" border className="mt-4 ">
        <LinkPanel.Title>Gå til tiltaksgjennomføringen</LinkPanel.Title>
        <LinkPanel.Description>
          <Todo /> tekst
        </LinkPanel.Description>
      </LinkPanel>
    </div>
  )
}
