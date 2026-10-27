import { fireEvent, render } from '@testing-library/react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FormErrorSummary } from './FormErrorSummary'

const TestForm = ({
  errorKey,
  fieldId,
  group
}: {
  errorKey: string
  fieldId: string
  group: boolean
}) => {
  const form = useForm()
  const { setError } = form

  useEffect(() => {
    setError(errorKey, { type: 'manual', message: 'Rett feltet' })
  }, [errorKey, setError])

  return (
    <FormProvider {...form}>
      <FormErrorSummary erEnkeltplass />
      {group ? (
        <fieldset id={fieldId}>
          <legend>Tilskudd</legend>
          <input type="checkbox" aria-label="Deaktivert valg" disabled />
          <input type="checkbox" aria-label="Aktivt valg" />
        </fieldset>
      ) : (
        <input id={fieldId} aria-label="Belop" />
      )}
    </FormProvider>
  )
}

describe.each(['document', 'closed shadow root'] as const)(
  'FormErrorSummary i %s',
  (rootType) => {
    it.each([
      [
        'prisinformasjon_anskaffelse-totalbelop',
        'anskaffelse-totalbelop',
        false
      ],
      ['prisinformasjon_pris-SKOLEPENGER', 'pris-SKOLEPENGER', false],
      [
        'prisinformasjon_tilleggsopplysninger-ingen-kostnader',
        'tilleggsopplysninger-ingen-kostnader',
        false
      ],
      [
        'prisinformasjon_tilskuddstype-checkbox',
        'tilskuddstype-checkbox',
        true
      ],
      ['kodeverkValg_UTDANNING', 'kodeverkValg_UTDANNING', false],
      ['startdato', 'startdato', false]
    ])('fokuserer og skroller til %s', (errorKey, fieldId, group) => {
      const host = render(<div />).container
      const root =
        rootType === 'document'
          ? document
          : host.attachShadow({ mode: 'closed' })
      const container = document.createElement('div')
      if (root instanceof Document) {
        root.body.appendChild(container)
      } else {
        root.appendChild(container)
        render(<input id={fieldId} aria-label="Felt utenfor webkomponenten" />)
      }

      const { getByRole } = render(
        <TestForm errorKey={errorKey} fieldId={fieldId} group={group} />,
        { container }
      )
      const target = group
        ? getByRole('checkbox', { name: 'Aktivt valg' })
        : getByRole('textbox', { name: 'Belop' })
      target.scrollIntoView = vi.fn()

      fireEvent.click(getByRole('link', { name: 'Rett feltet' }))

      expect(root.activeElement).toBe(target)
      expect(target.scrollIntoView).toHaveBeenCalledWith({ block: 'center' })
    })
  }
)
