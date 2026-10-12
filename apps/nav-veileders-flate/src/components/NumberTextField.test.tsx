import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { NumberTextField } from './NumberTextField'

const NumberTextFieldHarness = ({
  initialValue,
  inlineLabel = false,
  ariaLabel
}: {
  initialValue?: number
  inlineLabel?: boolean
  ariaLabel?: string
}) => {
  const [value, setValue] = useState<number | undefined>(initialValue)

  return (
    <NumberTextField
      id="number-field"
      label="Beløp"
      aria_label={ariaLabel}
      inlineLabel={inlineLabel}
      disabled={false}
      value={value}
      onChange={setValue}
    />
  )
}

describe('NumberTextField', () => {
  it('viser etiketten og eksisterende verdi', () => {
    render(<NumberTextFieldHarness initialValue={1234} />)

    expect(screen.getByRole('textbox', { name: 'Beløp' })).toHaveValue('1234')
  })

  it('beholder hele tallet når det limes inn med ulike mellomrom', () => {
    render(<NumberTextFieldHarness />)

    const field = screen.getByRole('textbox', { name: 'Beløp' })
    fireEvent.change(field, { target: { value: '1 234\u00a0567' } })

    expect(field).toHaveValue('1234567')
  })

  it.each(['', ' \u00a0\u202f'])(
    'tømmer verdien når feltet får verdien %j',
    (input) => {
      render(<NumberTextFieldHarness initialValue={123} />)

      const field = screen.getByRole('textbox', { name: 'Beløp' })
      fireEvent.change(field, { target: { value: input } })

      expect(field).toHaveValue('')
    }
  )

  it('beholder forrige verdi når teksten ikke inneholder et tall', () => {
    render(<NumberTextFieldHarness initialValue={123} />)

    const field = screen.getByRole('textbox', { name: 'Beløp' })
    fireEvent.change(field, { target: { value: 'abc' } })

    expect(field).toHaveValue('123')
  })

  it('viser inline-etikett og bruker aria_label som tilgjengelig navn', () => {
    render(<NumberTextFieldHarness inlineLabel ariaLabel="Antall deltakere" />)

    expect(screen.getByText('Beløp')).toBeVisible()
    expect(
      screen.getByRole('textbox', { name: 'Antall deltakere' })
    ).toBeVisible()
  })
})
