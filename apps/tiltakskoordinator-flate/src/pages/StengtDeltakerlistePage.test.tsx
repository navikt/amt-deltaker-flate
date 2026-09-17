import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StengtDeltakerlistePage } from './StengtDeltakerlistePage'

vi.mock('../hooks/useFocusPageLoad', () => ({
  useFocusPageLoad: () => ({ ref: null })
}))

describe('StengtDeltakerlistePage', () => {
  it('forklarer at deltakerlisten er stengt etter seks måneder', () => {
    render(<StengtDeltakerlistePage />)

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Deltakerlisten er stengt'
      })
    ).toBeTruthy()
    expect(
      screen.getByText(
        'Tiltaket ble avsluttet for mer enn 6 måneder siden. Deltakerlisten vises derfor ikke lenger.'
      )
    ).toBeTruthy()
  })
})
