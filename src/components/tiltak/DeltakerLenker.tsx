import { LinkPanel } from '@navikt/ds-react'
import { Todo } from '../Todo.tsx'

export const DeltakerLenker = () => {
  return (
    <>
      <LinkPanel>
        <LinkPanel.Description>
          <Todo /> Du kan ikke endre denne aktiviteten selv. Send en melding her til veilederen din
          hvis noe skal endres.
        </LinkPanel.Description>
      </LinkPanel>
      <LinkPanel>
        <LinkPanel.Title>
          <Todo /> Du har rett til å klage
        </LinkPanel.Title>
        <LinkPanel.Description>
          Du kan klage hvis du ikke ønsker å delta, er uenig i endringer på deltakelsen eller du
          ønsker et annet arbeidsmarkedstiltak. Fristen for å klage er seks uker fra du mottok
          informasjonen.
        </LinkPanel.Description>
      </LinkPanel>
      <LinkPanel>
        <LinkPanel.Title>
          <Todo /> Se hva som er delt med arrangøren
        </LinkPanel.Title>
      </LinkPanel>
    </>
  )
}
