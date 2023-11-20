import { describe, expect, it, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App from './App'

describe('Simple working test for Mikrofrontend', () => {
  afterEach(() => {
    cleanup()
  })

  it('has a text', () => {
    render(<App />)
    expect(screen.getByText('Påmelding')).toBeDefined()
  })
})
