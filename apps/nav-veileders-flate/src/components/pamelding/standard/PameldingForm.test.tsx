import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFormContext } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PameldingFormValues } from '../../../model/PameldingFormValues.ts'
import {
  lagDeltaker,
  renderWithDeltakerContext
} from '../../test-utils/deltaker-context-test-utils.tsx'
import { bakgrunnsinfoSporsmal } from '../bakgrunnsinfo-sporsmal.ts'
import { PameldingFormContextProvider } from '../PameldingFormContext.tsx'
import { PameldingForm } from './PameldingForm.tsx'

const onSubmit = vi.hoisted(() => vi.fn())

vi.mock('../FormButtons.tsx', () => ({
  PameldingFormButtons: () => {
    const { handleSubmit } = useFormContext<PameldingFormValues>()
    return (
      <button type="button" onClick={handleSubmit(onSubmit)}>
        Fortsett
      </button>
    )
  }
}))

const renderForm = (bakgrunnsinformasjon: string | null = null) =>
  renderWithDeltakerContext(
    <PameldingFormContextProvider>
      <PameldingForm />
    </PameldingFormContextProvider>,
    lagDeltaker({ bakgrunnsinformasjon })
  )

describe('PameldingForm', () => {
  beforeEach(() => {
    onSubmit.mockClear()
  })

  it.each([null, ''])(
    'prevents submission when background information is %j',
    async (bakgrunnsinformasjon) => {
      const user = userEvent.setup()
      renderForm(bakgrunnsinformasjon)

      await user.click(screen.getByRole('button', { name: 'Fortsett' }))

      expect(
        await screen.findByRole('link', { name: 'Bakgrunnsinfo må fylles ut' })
      ).toHaveAttribute('href', '#bakgrunnsinformasjon')
      expect(
        screen.getByRole('textbox', { name: bakgrunnsinfoSporsmal.label })
      ).toHaveAttribute('aria-invalid', 'true')
      expect(onSubmit).not.toHaveBeenCalled()
    }
  )

  it('prevents submission after clearing existing background information', async () => {
    const user = userEvent.setup()
    renderForm('Existing background information')
    const input = screen.getByRole('textbox', {
      name: bakgrunnsinfoSporsmal.label
    })

    await user.clear(input)
    await user.click(screen.getByRole('button', { name: 'Fortsett' }))

    expect(
      await screen.findByRole('link', { name: 'Bakgrunnsinfo må fylles ut' })
    ).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('clears the required-field error and allows submission after entering background information', async () => {
    const user = userEvent.setup()
    renderForm()
    const input = screen.getByRole('textbox', {
      name: bakgrunnsinfoSporsmal.label
    })

    await user.click(screen.getByRole('button', { name: 'Fortsett' }))
    await screen.findByRole('link', { name: 'Bakgrunnsinfo må fylles ut' })
    await user.type(input, 'Needs help finding work')
    await user.click(screen.getByRole('button', { name: 'Fortsett' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        bakgrunnsinformasjon: 'Needs help finding work'
      })
    )
    expect(input).not.toHaveAttribute('aria-invalid', 'true')
    expect(
      screen.queryByText('Bakgrunnsinfo må fylles ut')
    ).not.toBeInTheDocument()
  })
})
