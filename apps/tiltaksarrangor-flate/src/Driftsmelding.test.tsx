import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Driftsmelding } from './Driftsmelding'

const toggles = vi.hoisted(() => ({ visDriftsmelding: false }))

vi.mock('./hooks/useFeatureToggle', () => ({
  useFeatureToggle: () => toggles
}))

describe('Driftsmelding', () => {
  beforeEach(() => {
    toggles.visDriftsmelding = false
  })

  it('renders nothing when the toggle is off', () => {
    expect(renderToStaticMarkup(<Driftsmelding />)).toBe('')
  })

  it('renders the maintenance warning without alert role when the toggle is on', () => {
    toggles.visDriftsmelding = true
    const markup = renderToStaticMarkup(<Driftsmelding />)

    expect(markup).toContain(
      'Nylige endringer på deltakere vises ikke for øyeblikket.'
    )
    expect(markup).toMatch(/<title[^>]*>Advarsel<\/title>/)
    expect(markup).not.toContain('role="alert"')
  })
})
