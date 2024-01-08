import {Button, HStack, Textarea} from '@navikt/ds-react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'

interface Props {
    disableSubmit: boolean,
    onSendSomForslag: () => void,
    sendSomForslagLoading: boolean,
    onSendDirekte: () => void,
    sendDirekteLoading: boolean
}

export const OpprettPameldingForm = ({
  disableSubmit,
  onSendSomForslag,
  sendSomForslagLoading,
  onSendDirekte,
  sendDirekteLoading
}: Props) => {

  const FORSLAG_BTN_ID = 'sendSomForslagBtn'
  const DIREKTE_BTN_ID = 'sendDirekteBtn'

  const schema = z.object({
    bakgrunnsinformasjon: z.string()
      .min(10, 'minimum 10 tegn')
  })

  type FormSchema = z.infer<typeof schema>

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema),
    shouldFocusError: false
  })

  const {
    register,
    handleSubmit,
    formState: {errors, isValid}
  } = methods

  const handleFormSubmit = (submitType: 'sendSomForslagBtn' | 'sendDirekteBtn') => () => {
    if(submitType === FORSLAG_BTN_ID) {
      onSendSomForslag()
    }
    else if(submitType === DIREKTE_BTN_ID) {
      onSendDirekte()
    }
  }

  return (
    <form>
      {isValid}
      <Textarea
        label={'Bakgrunnsinformasjon (valgfritt)'}
        {...register('bakgrunnsinformasjon')}
        error={errors.bakgrunnsinformasjon?.message}
      />

      <HStack gap="4">
        <Button size="small"
          loading={sendSomForslagLoading}
          disabled={disableSubmit}
          type="button"
          onClick={handleSubmit(handleFormSubmit(FORSLAG_BTN_ID))}
        >
                    Send som forslag
        </Button>

        <Button size="small"
          variant="secondary"
          loading={sendDirekteLoading}
          disabled={disableSubmit}
          type="button"
          onClick={handleSubmit(handleFormSubmit(DIREKTE_BTN_ID))}
        >
                    Meld på uten å sende forslag
        </Button>

      </HStack>
    </form>
  )
}
