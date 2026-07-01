import {
  OpplaringKategorisering,
  OpplaringRepresenterer
} from '../model/kodeverk'
import {
  KodeverkAlternativType,
  KodeverkContainer,
  KodeverkResponse,
  KodeverkSertifiseringResponse,
  Seleksjonstype,
  VerdigruppeSokKilde
} from '../model/kodeverkResponse'
import { Tiltakskode } from '../model/deltaker'

/**
 * Konverterer en KodeverkResponse til det flate OpplaringKategorisering-formatet
 * ved å plukke ut alle elementer med valgt: true.
 */
export const toOpplaringKategorisering = (
  response: KodeverkResponse
): OpplaringKategorisering => ({
  valgteKategoriseringer: response.alternativer.flatMap(flattenContainer),
  valgteSertifiseringer: response.sertifiseringValg
})

const flattenContainer = (container: KodeverkContainer) => {
  if (container.type === KodeverkAlternativType.VERDIGRUPPE) {
    const valgte = container.alternativer
      .filter((a) => a.valgt)
      .map((a) => ({ id: a.id, visningsnavn: a.visningsnavn }))
    return [{ type: container.representerer, valgteElementer: valgte }]
  }

  if (container.type === KodeverkAlternativType.UTDANNING_GRUPPE) {
    const valgteUtdanninger = container.utdanninger
      .filter((u) => u.larefag.alternativer.some((v) => v.valgt))
      .map((u) => ({ id: u.id, visningsnavn: u.visningsnavn }))

    const valgteLarefag = container.utdanninger.flatMap((u) =>
      u.larefag.alternativer
        .filter((v) => v.valgt)
        .map((v) => ({ id: v.id, visningsnavn: v.visningsnavn }))
    )

    return [
      { type: container.representerer, valgteElementer: valgteUtdanninger },
      { type: OpplaringRepresenterer.LAREFAG, valgteElementer: valgteLarefag }
    ]
  }

  return []
}

export const createMockOpplaringKategorisering = (): OpplaringKategorisering =>
  toOpplaringKategorisering(
    getMockKodeverkResponse(Tiltakskode.ARBEIDSMARKEDSOPPLAERING)
  )

export const getMockKodeverkResponse = (
  tiltakskode: Tiltakskode
): KodeverkResponse =>
  mockKodeverkData.find((k) => k.tiltakskode === tiltakskode) ?? {
    tiltakskode,
    alternativer: [],
    sertifiseringValg: []
  }

export const mockKodeverkData: KodeverkResponse[] = [
  {
    tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
    alternativer: [
      {
        type: KodeverkAlternativType.VERDIGRUPPE,
        visningsnavn: 'Bransje',
        pakrevd: true,
        representerer: OpplaringRepresenterer.BRANSJE_ID,
        seleksjonstype: Seleksjonstype.ENKELTVALG,
        alternativer: [
          {
            id: '14886bad-a495-420a-9bae-d33e2d88041a',
            visningsnavn: 'Barne- og ungdomsarbeid',
            valgt: false
          },
          {
            id: 'e6749d6c-aacf-452d-baf2-d5fb5021912b',
            visningsnavn: 'Butikk- og salgsarbeid',
            valgt: true
          },
          {
            id: 'd9b1c8e0-1c3a-4f5b-9c2e-1a2b3c4d5e6f',
            visningsnavn: 'Bygg og anlegg',
            valgt: false
          },
          {
            id: '82bd7ce0-70f1-448b-8773-9015dea613e7',
            visningsnavn: 'Helse, pleie og omsorg',
            valgt: false
          },
          {
            id: '4733d7ef-d106-47a4-b335-bfd132c8ad31',
            visningsnavn: 'Industriarbeid',
            valgt: false
          },
          {
            id: 'd04dff0d-fdca-4839-9bdc-44c722af5d6f',
            visningsnavn: 'Ingeniør- og IKT-fag',
            valgt: false
          },
          {
            id: 'a86c1f7a-47c3-4f69-b138-89341107e0eb',
            visningsnavn: 'Kontorarbeid',
            valgt: false
          },
          {
            id: 'c8851a31-6362-4ee2-8989-e5da95726076',
            visningsnavn: 'Reiseliv, servering og transport',
            valgt: false
          },
          {
            id: '47c9d5f0-66ea-4e68-949d-86733346ee80',
            visningsnavn: 'Serviceyrker og annet arbeid',
            valgt: false
          },
          {
            id: '54ccb278-92ea-4835-8566-659e98602905',
            visningsnavn: 'Andre bransjer',
            valgt: false
          }
        ]
      },
      {
        type: KodeverkAlternativType.VERDIGRUPPE,
        visningsnavn: 'Førerkort',
        pakrevd: false,
        representerer: OpplaringRepresenterer.FORERKORT,
        seleksjonstype: Seleksjonstype.FLERVALG,
        alternativer: [
          {
            id: 'c67006e4-2629-4993-a047-92f31b0db557',
            visningsnavn: 'A1 - Lett motorsykkel',
            valgt: false
          },
          {
            id: 'ed44bd3a-aedb-4225-a3d8-c8f1b95fec5a',
            visningsnavn: 'A2 - Mellomtung motorsykkel',
            valgt: false
          },
          {
            id: 'ee66eb0b-d4a8-4527-800a-135dd3c0d422',
            visningsnavn: 'AM 147 - Mopedbil',
            valgt: false
          },
          {
            id: 'dee7d6b8-02dc-4b7e-bb3a-fa71cc9248e3',
            visningsnavn: 'AM - Moped',
            valgt: false
          },
          {
            id: '810fe1c6-56b0-4e00-8ae6-00fb574299e5',
            visningsnavn: 'A - Motorsykkel',
            valgt: false
          },
          {
            id: '84a40884-421c-406c-994d-4c4c15ef8bcc',
            visningsnavn: 'B 78 - Personbil med automatgir',
            valgt: false
          },
          {
            id: 'cdbebefc-2cec-48d0-9c8e-bd464e56cfaa',
            visningsnavn: 'BE - Personbil med tilhenger',
            valgt: false
          },
          {
            id: '79d1a970-e8f0-4ecd-8d5e-e7c8d5f3394c',
            visningsnavn: 'B - Personbil',
            valgt: true
          },
          {
            id: '69f88a08-e2de-461f-9258-4f8be546104a',
            visningsnavn: 'C1E - Lett lastebil med tilhenger',
            valgt: false
          },
          {
            id: 'c65936e4-479f-4c84-b106-6c9ec0cf9aee',
            visningsnavn: 'C1 - Lett lastebil',
            valgt: false
          },
          {
            id: '9a85cdeb-2f6d-44f6-bef2-2add850f7b27',
            visningsnavn: 'CE - Lastebil med tilhenger',
            valgt: false
          },
          {
            id: 'e3fcf1f7-1f20-4fca-bad5-422b7ee0418f',
            visningsnavn: 'C - Lastebil',
            valgt: true
          },
          {
            id: '34d00562-f382-4027-953d-2b6f6bb7e0e5',
            visningsnavn: 'D1E - Minibuss med tilhenger',
            valgt: false
          },
          {
            id: '5d890e23-6800-4574-a05d-24ca81f35a2a',
            visningsnavn: 'D1 - Minibuss',
            valgt: false
          },
          {
            id: 'e637320c-a5f0-4f7d-ad44-0a7c4654b4c2',
            visningsnavn: 'D - Buss',
            valgt: false
          },
          {
            id: 'a7376d16-b0da-4140-8e67-c589be2c0ea2',
            visningsnavn: 'DE - Buss med tilhenger',
            valgt: false
          },
          {
            id: '5b1e1732-a5e8-45ca-955f-548c65d11065',
            visningsnavn: 'S - Snøscooter',
            valgt: false
          },
          {
            id: '53896c05-7650-48ed-bf23-54ae78794eba',
            visningsnavn: 'T - Traktor',
            valgt: false
          }
        ]
      },
      {
        type: KodeverkAlternativType.VERDIGRUPPE_SOK,
        pakrevd: false,
        visningsnavn: 'Sertifiseringer',
        representerer: OpplaringRepresenterer.SERTIFISERINGER,
        seleksjonstype: Seleksjonstype.FLERVALG,
        kilde: VerdigruppeSokKilde.JANZZ_SERTIFISERING
      }
    ],
    sertifiseringValg: [{ id: 3, navn: 'Sertifisert zumba-instruktør' }]
  }
]

export const mockSertifiseringer: KodeverkSertifiseringResponse = [
  { konseptId: 90999, label: 'Datakortet del 1' },
  { konseptId: 2, label: 'Datakortet del 2' },
  { konseptId: 3, label: 'Sertifisert zumba-instruktør' },
  { konseptId: 345, label: 'Godkjent jagerpilot' }
]
