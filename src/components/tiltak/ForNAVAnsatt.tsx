import { Button, Heading, LinkPanel } from '@navikt/ds-react'
import { Todo } from '../Todo.tsx'
import { PencilIcon } from '@navikt/aksel-icons'

export const ForNAVAnsatt = () => {
  return (
    <div className="bg-white p-4 h-fit">
      <Heading level="2" size="medium" className="mb-4 ">
        For NAV-ansatt
      </Heading>
      <Button icon={<PencilIcon />} size="small" variant="secondary" className="mb-4 ">
        Endre deltakelse
      </Button>
      <div>
        <LinkPanel href="#" border>
          <LinkPanel.Title>Gå til tiltaksgjennomføringen</LinkPanel.Title>
          <LinkPanel.Description>
            <Todo /> tekst
          </LinkPanel.Description>
        </LinkPanel>
      </div>
    </div>
  )
}
