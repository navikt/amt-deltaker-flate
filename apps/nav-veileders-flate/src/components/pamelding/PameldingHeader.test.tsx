import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  DeltakelseInnhold,
  OpplaringRepresenterer,
  Tiltakskode
} from 'deltaker-flate-common'
import { DeltakerStatusType } from 'deltaker-flate-common'
import { Deltakerliste } from '../../api/data/deltaker'
import { PameldingHeader } from './PameldingHeader.tsx'

const lagDeltakerliste = (
  overrides: Partial<Deltakerliste> = {}
): Deltakerliste =>
  ({
    deltakerlisteId: '1',
    deltakerlisteNavn: 'Norskopplæring, grunnleggende ferdigheter og FOV',
    tiltakskode: Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV,
    arrangorNavn: 'A & A Eiendom Ans',
    arrangor: { navn: 'A & A Eiendom Ans', organisasjonsnummer: '123456789' },
    erEnkeltplass: true,
    oppstartstype: null,
    startdato: null,
    sluttdato: null,
    status: null,
    tilgjengeligInnhold: { ledetekst: null, innhold: [] },
    oppmoteSted: null,
    pameldingstype: 'DIREKTE_VEDTAK',
    opplaringKategoriseringValg: null,
    ...overrides
  }) as unknown as Deltakerliste

describe('PameldingHeader - FOV heading', () => {
  it('bruker kurstype fra kodeverk i heading når FOV har kodeverk med tittel', () => {
    render(
      <PameldingHeader
        deltakerStatus={{
          id: '1',
          type: DeltakerStatusType.UTKAST_TIL_PAMELDING,
          aarsak: null,
          gyldigFra: new Date(),
          gyldigTil: null,
          opprettet: new Date()
        }}
        deltakerliste={lagDeltakerliste({
          opplaringKategoriseringValg: {
            valgteKategoriseringer: [
              {
                type: OpplaringRepresenterer.KURSTYPE_ID,
                valgteElementer: [
                  { id: 'kurs-1', visningsnavn: 'Norskopplæring' }
                ]
              }
            ],
            valgteSertifiseringer: []
          }
        })}
        vedtaksinformasjon={null}
      />
    )

    expect(
      screen.getByRole('heading', {
        name: 'Norskopplæring hos A & A Eiendom Ans'
      })
    ).toBeInTheDocument()
  })

  it('faller tilbake til standard tiltaksnavn når kodeverk mangler tittel', () => {
    render(
      <PameldingHeader
        deltakerStatus={{
          id: '1',
          type: DeltakerStatusType.UTKAST_TIL_PAMELDING,
          aarsak: null,
          gyldigFra: new Date(),
          gyldigTil: null,
          opprettet: new Date()
        }}
        deltakerliste={lagDeltakerliste()}
        vedtaksinformasjon={null}
      />
    )

    expect(
      screen.getByRole('heading', {
        name: 'Norskopplæring, grunnleggende ferdigheter og FOV hos A & A Eiendom Ans'
      })
    ).toBeInTheDocument()
  })

  it('bruker standard tiltaksnavn for andre tiltakskoder selv med kodeverk.tittel', () => {
    render(
      <PameldingHeader
        deltakerStatus={{
          id: '1',
          type: DeltakerStatusType.KLADD,
          aarsak: null,
          gyldigFra: new Date(),
          gyldigTil: null,
          opprettet: new Date()
        }}
        deltakerliste={lagDeltakerliste({
          tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
          deltakerlisteNavn: 'Arbeidsmarkedsopplæring',
          arrangorNavn: 'Kurs AS',
          opplaringKategoriseringValg: {
            valgteKategoriseringer: [
              {
                type: OpplaringRepresenterer.BRANSJE_ID,
                valgteElementer: [
                  { id: 'kurs-2', visningsnavn: 'Bransje: Bygg' }
                ]
              }
            ],
            valgteSertifiseringer: []
          }
        })}
        vedtaksinformasjon={null}
      />
    )

    expect(
      screen.getByRole('heading', {
        name: 'Arbeidsmarkedsopplæring hos Kurs AS'
      })
    ).toBeInTheDocument()
  })
})

describe('DeltakelseInnhold', () => {
  describe('harKodeverk', () => {
    it('returnerer null når ingen innhold og ingen kodeverk', () => {
      const { container } = render(
        <DeltakelseInnhold
          tiltakskode={Tiltakskode.ARBEIDSMARKEDSOPPLAERING}
          deltakelsesinnhold={null}
          kodeverk={null}
          heading={<h3>Heading</h3>}
        />
      )
      expect(container).toBeEmptyDOMElement()
    })

    it('viser kodeverk-valg når deltakelsesinnhold er null men kodeverk har valg', () => {
      render(
        <DeltakelseInnhold
          tiltakskode={Tiltakskode.ARBEIDSMARKEDSOPPLAERING}
          deltakelsesinnhold={null}
          kodeverk={{
            valgteKategoriseringer: [
              {
                type: OpplaringRepresenterer.BRANSJE_ID,
                valgteElementer: [{ id: 'bransje-3', visningsnavn: 'IT' }]
              }
            ],
            valgteSertifiseringer: []
          }}
          heading={<h3>Heading</h3>}
        />
      )
      expect(screen.getByText('Bransje: IT')).toBeInTheDocument()
    })

    it('returnerer null når kodeverk har tom valg og null tittel', () => {
      const { container } = render(
        <DeltakelseInnhold
          tiltakskode={Tiltakskode.ARBEIDSMARKEDSOPPLAERING}
          deltakelsesinnhold={null}
          kodeverk={{
            valgteKategoriseringer: [],
            valgteSertifiseringer: []
          }}
          heading={<h3>Heading</h3>}
        />
      )
      expect(container).toBeEmptyDOMElement()
    })
  })
})
