import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  DeltakelseInnhold,
  DeltakerStatusType,
  OpplaringRepresenterer,
  Tiltakskode
} from 'deltaker-flate-common'
import { Deltakerliste } from '../../api/data/deltaker'
import { PameldingHeader } from './PameldingHeader.tsx'

const lagDeltakerliste = (
  overrides: Partial<Deltakerliste> = {}
): Deltakerliste =>
  ({
    deltakerlisteId: '1',
    deltakerlisteNavn: 'Norskopplæring, grunnleggende ferdigheter og FOV',
    tiltakskode: Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV,
    tiltakskodeResponse: {
      kode: Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV,
      visningsnavn: 'Norskopplæring, grunnleggende ferdigheter og FOV'
    },
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
    visningsnavn: {
      tiltakHosArrangorTittel:
        'Norskopplæring, grunnleggende ferdigheter og FOV hos A & A Eiendom Ans',
      tiltakHosArrangorIngressTekst:
        'Norskopplæring, grunnleggende ferdigheter og FOV hos A & A Eiendom Ans',
      kladdTiltakHosArrangorTittel:
        'Norskopplæring, grunnleggende ferdigheter og FOV hos A & A Eiendom Ans'
    },
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
          visningsnavn: {
            tiltakHosArrangorTittel: 'Norskopplæring hos A & A Eiendom Ans',
            tiltakHosArrangorIngressTekst:
              'Norskopplæring hos A & A Eiendom Ans',
            kladdTiltakHosArrangorTittel:
              'Kladd: Norskopplæring hos A & A Eiendom Ans'
          },
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

  it('bruker kladdTiltakHosArrangorTittel når status er KLADD', () => {
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
          visningsnavn: {
            tiltakHosArrangorTittel: 'Arbeidsmarkedsopplæring hos Kurs AS',
            tiltakHosArrangorIngressTekst:
              'Arbeidsmarkedsopplæring hos Kurs AS',
            kladdTiltakHosArrangorTittel:
              'Kladd: Arbeidsmarkedsopplæring hos Kurs AS'
          },
          tiltakskodeResponse: {
            kode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
            visningsnavn: 'Arbeidsmarkedsopplæring'
          },
          arrangorNavn: 'Kurs AS'
        })}
        vedtaksinformasjon={null}
      />
    )

    expect(
      screen.getByRole('heading', {
        name: 'Kladd: Arbeidsmarkedsopplæring hos Kurs AS'
      })
    ).toBeInTheDocument()
  })
})

describe('DeltakelseInnhold', () => {
  describe('opplaringKategorisering', () => {
    it('returnerer null når ingen innhold og ingen opplaringKategorisering', () => {
      const { container } = render(
        <DeltakelseInnhold
          tiltakskode={Tiltakskode.ARBEIDSMARKEDSOPPLAERING}
          deltakelsesinnhold={null}
          opplaringKategoriseringValg={null}
          heading={<h3>Heading</h3>}
        />
      )
      expect(container).toBeEmptyDOMElement()
    })

    it('viser opplaringKategorisering-valg når deltakelsesinnhold er null men opplaringKategorisering har valg', () => {
      render(
        <DeltakelseInnhold
          tiltakskode={Tiltakskode.ARBEIDSMARKEDSOPPLAERING}
          deltakelsesinnhold={null}
          opplaringKategoriseringValg={{
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

    it('returnerer null når opplaringKategorisering har tom valg og null tittel', () => {
      const { container } = render(
        <DeltakelseInnhold
          tiltakskode={Tiltakskode.ARBEIDSMARKEDSOPPLAERING}
          deltakelsesinnhold={null}
          opplaringKategoriseringValg={{
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
