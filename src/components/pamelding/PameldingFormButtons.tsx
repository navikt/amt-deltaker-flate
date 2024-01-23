import {Button, HelpText, VStack} from '@navikt/ds-react'
import {useFormContext} from 'react-hook-form'
import {PameldingFormValues} from '../../model/PameldingFormValues.ts'

interface Props {
    sendSomForslagLoading: boolean,
    disableButtons: boolean,
    sendDirekteLoading: boolean,
    onSendDirekte: (data: PameldingFormValues) => void
    onSendSomForslag: (data: PameldingFormValues) => void
}

export const PameldingFormButtons = (
  {
    sendSomForslagLoading,
    disableButtons,
    sendDirekteLoading,
    onSendSomForslag,
    onSendDirekte
  }: Props
) => {
  const FORSLAG_BTN_ID = 'sendSomForslagBtn'
  const DIREKTE_BTN_ID = 'sendDirekteBtn'

  const {handleSubmit} = useFormContext<PameldingFormValues>()

  const handleFormSubmit =
        (submitType: 'sendSomForslagBtn' | 'sendDirekteBtn') => (data: PameldingFormValues) => {
          if (submitType === FORSLAG_BTN_ID) {
            onSendSomForslag(data)
          } else if (submitType === DIREKTE_BTN_ID) {
            onSendDirekte(data)
          } else {
            throw new Error(`no handler for ${submitType}`)
          }
        }

  return (
    <VStack gap="4" className="mt-8">
      <div className="flex items-center">
        <Button
          size="small"
          loading={sendSomForslagLoading}
          disabled={disableButtons}
          type="button"
          onClick={handleSubmit(handleFormSubmit(FORSLAG_BTN_ID))}
        >
                    Del utkast og gjør klar vedtaket
        </Button>
        <div className="ml-4">
          <HelpText>
                        Når utkastet deles med bruker så kan de lese gjennom hva du foreslår å sende til
                        arrangøren. Bruker blir varslet og kan finne lenke på innlogget nav.no og gjennom
                        aktivitetsplanen. Når bruker godtar så blir vedtaket satt.
          </HelpText>
        </div>
      </div>

      <div className="flex items-center">
        <Button
          size="small"
          variant="secondary"
          loading={sendDirekteLoading}
          disabled={disableButtons}
          type="button"
          onClick={handleSubmit(handleFormSubmit(DIREKTE_BTN_ID))}
        >
                    Fortsett uten å dele utkastet
        </Button>
        <div className="ml-4">
          <HelpText>
                        Utkastet deles ikke til brukeren. Brukeren skal allerede vite hvilke opplysninger
                        som blir delt med tiltaksarrangør.
          </HelpText>
        </div>
      </div>
    </VStack>
  )
}
