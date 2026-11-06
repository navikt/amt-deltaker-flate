import { act, fireEvent, render } from '@testing-library/react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FormErrorSummary } from './FormErrorSummary'

const TestForm = ({
  errorKey,
  fieldId,
  group,
  erEnkeltplass = true
}: {
  errorKey: string
  fieldId: string
  group: boolean
  erEnkeltplass?: boolean
}) => {
  const form = useForm({ shouldFocusError: false })
  const { setError } = form

  useEffect(() => {
    setError(errorKey, { type: 'manual', message: 'Rett feltet' })
  }, [errorKey, setError])

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)}>
        <FormErrorSummary erEnkeltplass={erEnkeltplass} />
        {group ? (
          <fieldset id={fieldId}>
            <legend>Tilskudd</legend>
            <input type="checkbox" aria-label="Deaktivert valg" disabled />
            <input
              type="checkbox"
              aria-label="Aktivt valg"
              {...form.register(errorKey, { required: 'Rett feltet' })}
            />
          </fieldset>
        ) : (
          <input
            id={fieldId}
            aria-label="Belop"
            {...form.register(errorKey, { required: 'Rett feltet' })}
          />
        )}
        {form.formState.errors[errorKey] && <span>Feil ved feltet</span>}
        <button type="submit">Send inn</button>
      </form>
    </FormProvider>
  )
}

describe.each([true, false])(
  'FormErrorSummary med erEnkeltplass=%s',
  (erEnkeltplass) => {
    it('flytter ikke fokus når sammendraget dukker opp igjen uten ny innsending', async () => {
      const { getByRole, queryByRole, findByRole, getByText } = render(
        <TestForm
          errorKey="dagerPerUke"
          fieldId="dagerPerUke"
          group={false}
          erEnkeltplass={erEnkeltplass}
        />
      )
      const input = getByRole('textbox', { name: 'Belop' })
      const submit = getByRole('button', { name: 'Send inn' })

      await act(async () => {
        fireEvent.click(submit)
      })
      expect(
        await findByRole('link', { name: 'Rett feltet' })
      ).toBeInTheDocument()

      input.focus()
      await act(async () => {
        fireEvent.change(input, { target: { value: '1' } })
      })

      expect(
        queryByRole('link', { name: 'Rett feltet' })
      ).not.toBeInTheDocument()
      expect(document.activeElement).toBe(input)

      await act(async () => {
        fireEvent.change(input, { target: { value: '' } })
        fireEvent.blur(input)
      })

      expect(getByText('Feil ved feltet')).toBeInTheDocument()
      expect(queryByRole('link', { name: 'Rett feltet' })).toBeInTheDocument()
      expect(document.activeElement).toBe(input)

      await act(async () => {
        fireEvent.click(submit)
      })
      expect(
        await findByRole('link', { name: 'Rett feltet' })
      ).toBeInTheDocument()
      expect(document.activeElement).toHaveAttribute('tabindex', '-1')
      expect(document.activeElement).toContainElement(
        getByRole('link', { name: 'Rett feltet' })
      )
    })

    it('viser ikke sammendrag eller flytter fokus før innsending', async () => {
      const { getByRole, queryByRole, findByRole } = render(
        <TestForm
          errorKey="dagerPerUke"
          fieldId="dagerPerUke"
          group={false}
          erEnkeltplass={erEnkeltplass}
        />
      )

      expect(
        queryByRole('link', { name: 'Rett feltet' })
      ).not.toBeInTheDocument()
      expect(
        queryByRole('heading', {
          name: 'For å gå videre må du rette opp følgende:'
        })
      ).not.toBeInTheDocument()

      const input = getByRole('textbox', { name: 'Belop' })
      input.focus()
      expect(document.activeElement).toBe(input)

      fireEvent.click(getByRole('button', { name: 'Send inn' }))

      expect(
        await findByRole('link', { name: 'Rett feltet' })
      ).toBeInTheDocument()
      expect(document.activeElement).not.toBe(input)
    })
  }
)

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
    ])('fokuserer og skroller til %s', async (errorKey, fieldId, group) => {
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

      await act(async () => {
        fireEvent.click(getByRole('button', { name: 'Send inn' }))
      })

      fireEvent.click(getByRole('link', { name: 'Rett feltet' }))

      expect(root.activeElement).toBe(target)
      expect(target.scrollIntoView).toHaveBeenCalledWith({ block: 'center' })
    })
  }
)
