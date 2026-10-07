import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { EndrePrisValg, EndrePrisValgType } from './EndrePrisValg.tsx'

describe('EndrePrisValg', () => {
  it('viser informasjon når prisendring velges', async () => {
    const user = userEvent.setup()

    const TestComponent = () => {
      const [value, setValue] = useState<EndrePrisValgType>()
      return <EndrePrisValg onChange={setValue} value={value} />
    }

    render(<TestComponent />)

    await user.click(screen.getByRole('radio', { name: 'Ja' }))

    expect(screen.getByText('Dette må du gjøre')).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Lagre denne endringen.')).toBeInTheDocument()
    expect(
      screen.getByText('Legg inn en endring i pris og betalingsbetingelser.')
    ).toBeInTheDocument()
  })

  it('kaller onChange med valgt prisalternativ', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<EndrePrisValg onChange={onChange} value={undefined} />)

    await user.click(screen.getByRole('radio', { name: 'Nei' }))

    expect(onChange).toHaveBeenCalledWith(EndrePrisValgType.NEI)
  })
})
