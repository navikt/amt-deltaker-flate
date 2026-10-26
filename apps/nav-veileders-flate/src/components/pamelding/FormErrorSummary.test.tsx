import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { PameldingEnkeltplassFormValues } from '../../model/PameldingEnkeltplassFormValues'
import { PameldingFormValues } from '../../model/PameldingFormValues'
import { FormErrorSummary } from './FormErrorSummary'

const FormErrorSummaryHarness = () => {
  const methods = useForm<PameldingEnkeltplassFormValues>()
  const {
    formState: { errors },
    setError
  } = methods

  return (
    <FormProvider {...methods}>
      <button
        type="button"
        onClick={() =>
          setError('startdato', {
            type: 'manual',
            message: 'Feil på startdato'
          })
        }
      >
        Sett én feil
      </button>
      <button
        type="button"
        onClick={() => {
          setError('startdato', {
            type: 'manual',
            message: 'Feil på startdato'
          })
          setError('sluttdato', {
            type: 'manual',
            message: 'Feil på sluttdato'
          })
        }}
      >
        Sett to feil
      </button>
      <output>{Object.keys(errors).length} feil</output>
      <FormErrorSummary erEnkeltplass={true} />
    </FormProvider>
  )
}

const StandardFormErrorSummaryHarness = () => {
  const methods = useForm<PameldingFormValues>()
  const {
    formState: { errors },
    setError
  } = methods

  return (
    <FormProvider {...methods}>
      <button
        type="button"
        onClick={() =>
          setError('valgteInnhold', {
            type: 'manual',
            message: 'Feil på innhold'
          })
        }
      >
        Sett én feil
      </button>
      <FormErrorSummary erEnkeltplass={false} />
      <output>{Object.keys(errors).length} feil</output>
    </FormProvider>
  )
}

describe('FormErrorSummary i enkeltplass-skjemaet', () => {
  it('viser ikke oppsummeringen med én feil', async () => {
    const user = userEvent.setup()
    render(<FormErrorSummaryHarness />)

    await user.click(screen.getByRole('button', { name: 'Sett én feil' }))

    expect(await screen.findByText('1 feil')).toBeInTheDocument()
    expect(
      screen.queryByText('For å gå videre må du rette opp følgende:')
    ).not.toBeInTheDocument()
  })

  it('viser oppsummeringen med flere feil', async () => {
    const user = userEvent.setup()
    render(<FormErrorSummaryHarness />)

    await user.click(screen.getByRole('button', { name: 'Sett to feil' }))

    expect(await screen.findByText('2 feil')).toBeInTheDocument()
    expect(
      screen.getByText('For å gå videre må du rette opp følgende:')
    ).toBeInTheDocument()
    expect(screen.getByText('Feil på startdato')).toBeInTheDocument()
    expect(screen.getByText('Feil på sluttdato')).toBeInTheDocument()
  })
})

describe('FormErrorSummary i standardskjemaet', () => {
  it('viser oppsummeringen med én feil', async () => {
    const user = userEvent.setup()
    render(<StandardFormErrorSummaryHarness />)

    await user.click(screen.getByRole('button', { name: 'Sett én feil' }))

    expect(await screen.findByText('1 feil')).toBeInTheDocument()
    expect(
      screen.getByText('For å gå videre må du rette opp følgende:')
    ).toBeInTheDocument()
    expect(screen.getByText('Feil på innhold')).toBeInTheDocument()
  })
})
