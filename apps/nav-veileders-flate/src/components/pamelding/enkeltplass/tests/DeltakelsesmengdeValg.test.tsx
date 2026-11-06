import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFormContext } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { PameldingEnkeltplassFormValues } from '../../../../model/PameldingEnkeltplassFormValues'
import { DeltakelsesmengdeValg } from '../DeltakelsesmengdeValg'
import { renderWithProviders } from './test-utils'

const FeltMedSkjemaverdi = () => {
  const { watch } = useFormContext<PameldingEnkeltplassFormValues>()

  return (
    <>
      <DeltakelsesmengdeValg />
      <output aria-label="Skjemaverdi">
        {JSON.stringify(watch('dagerPerUke'))}
      </output>
    </>
  )
}

const setup = (dagerPerUke: number | null = null) => {
  const user = userEvent.setup()
  renderWithProviders(<FeltMedSkjemaverdi />, {
    defaultValues: { dagerPerUke }
  })

  return {
    user,
    input: screen.getByRole('textbox', {
      name: 'Antall dager i uka som personen deltar (valgfritt)'
    })
  }
}

describe('DeltakelsesmengdeValg', () => {
  it('viser eksisterende antall dager', () => {
    const { input } = setup(3)

    expect(input).toHaveValue('3')
  })

  it('lagrer antall dager som et tall', async () => {
    const { user, input } = setup()

    await user.type(input, '5')

    expect(input).toHaveValue('5')
    expect(screen.getByLabelText('Skjemaverdi')).toHaveTextContent('5')
  })

  it('lagrer null når feltet tømmes', async () => {
    const { user, input } = setup(3)

    await user.clear(input)

    expect(input).toHaveValue('')
    expect(screen.getByLabelText('Skjemaverdi')).toHaveTextContent('null')
  })

  it('beholder forrige tall ved bokstaver', async () => {
    const { user, input } = setup(3)

    await user.type(input, 'x')

    expect(input).toHaveValue('3')
    expect(screen.getByLabelText('Skjemaverdi')).toHaveTextContent('3')
  })
})
