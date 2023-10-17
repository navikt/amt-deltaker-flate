import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import Mikrofrontend from './Mikrofrontend'

describe('Simple working test for Mikrofrontend', () => {
  it('has a text', () => {
    render(<Mikrofrontend />)
    expect(screen.getByText('Påmelidng')).toBeDefined()
  })
})
