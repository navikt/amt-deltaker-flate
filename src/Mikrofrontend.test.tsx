import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import Mikrofrontend from './Mikrofrontend'

describe('Simple working test for Mikrofrontend', () => {
  afterEach(() => {
    cleanup()
  })

  it('has a text', () => {
    render(<Mikrofrontend />)
    expect(screen.getByText('Påmelding')).toBeDefined()
  })
})
