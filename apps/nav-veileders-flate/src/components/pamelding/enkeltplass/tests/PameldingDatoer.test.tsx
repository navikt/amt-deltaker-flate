import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { PameldingDatoer } from '../PameldingDatoer'
import { renderWithProviders } from './test-utils'

const renderPameldingDatoer = (
  defaultStartdato?: string,
  defaultSluttdato?: string
) => {
  return renderWithProviders(
    <PameldingDatoer
      defaultStartdato={defaultStartdato}
      defaultSluttdato={defaultSluttdato}
    />,
    {
      defaultValues: {
        startdato: defaultStartdato,
        sluttdato: defaultSluttdato
      }
    }
  )
}

describe('PameldingDatoer', () => {
  it('rendrer start- og sluttdato-felt', () => {
    renderPameldingDatoer()
    expect(screen.getByLabelText('Startdato')).toBeInTheDocument()
    expect(screen.getByLabelText('Sluttdato')).toBeInTheDocument()
  })

  it('viser default startdato', () => {
    renderPameldingDatoer('01.07.2025')
    expect(screen.getByLabelText('Startdato')).toHaveValue('01.07.2025')
  })

  it('viser default sluttdato', () => {
    renderPameldingDatoer('01.07.2025', '01.12.2025')
    expect(screen.getByLabelText('Sluttdato')).toHaveValue('01.12.2025')
  })

  it('lar bruker skrive inn startdato', async () => {
    const user = userEvent.setup()
    renderPameldingDatoer()

    const input = screen.getByLabelText('Startdato')
    await user.click(input)
    await user.type(input, '15.08.2025')
    await user.tab()

    expect(input).toHaveValue('15.08.2025')
  })

  it('lar bruker skrive inn sluttdato', async () => {
    const user = userEvent.setup()
    renderPameldingDatoer()

    const input = screen.getByLabelText('Sluttdato')
    await user.click(input)
    await user.type(input, '15.12.2025')
    await user.tab()

    expect(input).toHaveValue('15.12.2025')
  })
})
