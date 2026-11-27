import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Pameldingstype,
  Tiltakskode,
  UKJENT_ARRANGOR
} from 'deltaker-flate-common'
import { UtkastDeltaker } from './UtkastDeltaker'
import {
  lagDeltaker,
  renderWithDeltakerContext
} from '../test-utils/deltaker-context-test-utils'

describe('UtkastDeltaker - arrangør', () => {
  it.each([
    {
      arrangor: { navn: 'Ny arrangør', organisasjonsnummer: '123456789' },
      forventetNavn: 'Ny arrangør'
    },
    { arrangor: null, forventetNavn: UKJENT_ARRANGOR },
    { arrangor: undefined, forventetNavn: UKJENT_ARRANGOR }
  ])(
    'viser $forventetNavn når arrangør er $arrangor',
    ({ arrangor, forventetNavn }) => {
      const deltaker = lagDeltaker(
        {},
        { arrangor, pameldingstype: Pameldingstype.DIREKTE_VEDTAK }
      )

      renderWithDeltakerContext(<UtkastDeltaker />, deltaker)

      expect(
        screen.getByText(`Før vi sender dette til ${forventetNavn}`, {
          exact: false
        })
      ).toBeInTheDocument()
      expect(
        screen.getByText(`og ${forventetNavn} mottar informasjon.`, {
          exact: false
        })
      ).toBeInTheDocument()
    }
  )
})

describe('UtkastDeltaker - Deltakelsesmengde', () => {
  const stottetTiltakDeltaker = lagDeltaker()
  const ikkeStottetTiltakDeltaker = {
    ...stottetTiltakDeltaker,
    deltakerliste: {
      ...stottetTiltakDeltaker.deltakerliste,
      tiltakskode: {
        kode: Tiltakskode.OPPFOLGING,
        visningsnavn: 'Oppfølging'
      }
    }
  }

  it('viser deltakelsesmengde når tiltak støtter det', () => {
    renderWithDeltakerContext(<UtkastDeltaker />, stottetTiltakDeltaker)
    expect(screen.getByText('Deltakelsesmengde')).toBeInTheDocument()
  })

  it('skjuler deltakelsesmengde når tiltak ikke støtter det', () => {
    renderWithDeltakerContext(<UtkastDeltaker />, ikkeStottetTiltakDeltaker)
    expect(screen.queryByText('Deltakelsesmengde')).not.toBeInTheDocument()
  })
})
