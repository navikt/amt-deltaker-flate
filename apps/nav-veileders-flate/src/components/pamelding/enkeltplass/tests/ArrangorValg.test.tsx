import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as brregHook from '../../../../hooks/useSokBrregUnderenhet'
import { ArrangorValg } from '../ArrangorValg'
import { createDeltaker, renderWithProviders } from './test-utils'

const mockSokResult = (
  enheter: { organisasjonsnummer: string; navn: string }[]
) => {
  vi.spyOn(brregHook, 'useSokBrregUnderenhet').mockReturnValue({
    data: enheter
  } as ReturnType<typeof brregHook.useSokBrregUnderenhet>)
}

const renderArrangorValg = (
  arrangor: { navn: string; organisasjonsnummer: string } | null = null
) => {
  const deltaker = createDeltaker(arrangor)
  return renderWithProviders(<ArrangorValg />, {
    deltaker,
    defaultValues: {
      arrangorUnderenhet: arrangor?.organisasjonsnummer ?? ''
    }
  })
}

describe('ArrangorValg', () => {
  beforeEach(() => {
    mockSokResult([])
  })

  it('rendrer combobox med label', () => {
    renderArrangorValg()
    expect(
      screen.getByLabelText('Tiltaksarrangør - underenhet')
    ).toBeInTheDocument()
  })

  it('viser initial arrangør som valgt når den finnes', () => {
    const arrangor = {
      navn: 'Muligheter AS',
      organisasjonsnummer: '123456789'
    }
    renderArrangorValg(arrangor)

    expect(screen.getByText('Muligheter AS - 123456789')).toBeInTheDocument()
  })

  it('viser ingen valgt arrangør når deltaker ikke har arrangør', () => {
    renderArrangorValg()
    expect(
      screen.queryByRole('option', { selected: true })
    ).not.toBeInTheDocument()
  })

  it('viser søkeresultater når bruker søker', async () => {
    const user = userEvent.setup()
    mockSokResult([
      { organisasjonsnummer: '999999999', navn: 'Ny Arrangør AS' },
      { organisasjonsnummer: '888888888', navn: 'Annen Arrangør AS' }
    ])

    renderArrangorValg()

    const input = screen.getByLabelText('Tiltaksarrangør - underenhet')
    await user.click(input)
    await user.type(input, 'Ny')

    expect(
      screen.getByText('Annen Arrangør AS - 888888888')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: 'Ny Arrangør AS - 999999999' })
    ).toBeInTheDocument()
  })

  it('velger ny arrangør fra søkeresultater', async () => {
    const user = userEvent.setup()
    mockSokResult([
      { organisasjonsnummer: '999999999', navn: 'Ny Arrangør AS' }
    ])

    renderArrangorValg()

    const input = screen.getByLabelText('Tiltaksarrangør - underenhet')
    await user.click(input)
    await user.type(input, 'Ny')

    const option = screen.getByRole('option', {
      name: 'Ny Arrangør AS - 999999999'
    })
    await user.click(option)

    expect(
      screen.getByRole('option', {
        name: 'Ny Arrangør AS - 999999999',
        selected: true
      })
    ).toBeInTheDocument()
  })

  it('kan tømme valgt arrangør', async () => {
    const user = userEvent.setup()
    const arrangor = {
      organisasjonsnummer: '999999999',
      navn: 'Ny Arrangør AS'
    }

    mockSokResult([arrangor])
    renderArrangorValg(arrangor)

    const input = screen.getByLabelText('Tiltaksarrangør - underenhet')
    await user.click(input)

    const selectedOption = screen.getByRole('option', {
      name: 'Ny Arrangør AS - 999999999',
      selected: true
    })
    await user.click(selectedOption)

    expect(
      screen.queryByRole('option', {
        name: 'Ny Arrangør AS - 999999999',
        selected: true
      })
    ).not.toBeInTheDocument()
  })

  it('kan tømme initial arrangør uten at den kommer tilbake', async () => {
    const user = userEvent.setup()
    const arrangor = {
      navn: 'Muligheter AS',
      organisasjonsnummer: '123456789'
    }

    mockSokResult([arrangor])
    renderArrangorValg(arrangor)

    const input = screen.getByLabelText('Tiltaksarrangør - underenhet')
    await user.click(input)

    const selectedOption = screen.getByRole('option', {
      name: 'Muligheter AS - 123456789',
      selected: true
    })
    expect(selectedOption).toBeInTheDocument()

    await user.click(selectedOption)

    expect(
      screen.queryByRole('option', {
        name: 'Muligheter AS - 123456789',
        selected: true
      })
    ).not.toBeInTheDocument()
  })
})
