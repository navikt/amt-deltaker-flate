import { Tiltakskode } from 'deltaker-flate-common'
import {
  KodeverkAlternativType,
  KodeverkResponse,
  KodeverkSertifiseringResponse,
  Seleksjonstype,
  VerdigruppeSokKilde
} from '../api/data/kodeverk'

export const createMockKodeverkResponse = (
  tiltakskode: Tiltakskode
): KodeverkResponse => {
  return (
    mockKodeverk.find((kodeverk) => kodeverk.tiltakskode === tiltakskode) ?? {
      tiltakskode,
      alternativer: []
    }
  )
}

const mockKodeverk: KodeverkResponse[] = [
  {
    tiltakskode: Tiltakskode.ARBEIDSMARKEDSOPPLAERING,
    alternativer: [
      {
        type: KodeverkAlternativType.VERDIGRUPPE,
        id: null,
        visningsnavn: 'Bransje',
        representerer: 'bransje',
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
          }
        ]
      },
      {
        type: KodeverkAlternativType.VERDIGRUPPE,
        id: null,
        visningsnavn: 'Førerkort',
        representerer: 'forerkort',
        seleksjonstype: Seleksjonstype.FLERVALG,
        alternativer: [
          {
            id: '79d1a970-e8f0-4ecd-8d5e-e7c8d5f3394c',
            visningsnavn: 'B - Personbil',
            valgt: false
          },
          {
            id: 'e3fcf1f7-1f20-4fca-bad5-422b7ee0418f',
            visningsnavn: 'C - Lastebil',
            valgt: false
          },
          {
            id: '9a85cdeb-2f6d-44f6-bef2-2add850f7b27',
            visningsnavn: 'CE - Lastebil med tilhenger',
            valgt: false
          },
          {
            id: 'e637320c-a5f0-4f7d-ad44-0a7c4654b4c2',
            visningsnavn: 'D - Buss',
            valgt: false
          }
        ]
      },
      {
        type: KodeverkAlternativType.VERDIGRUPPE_SOK,
        id: null,
        visningsnavn: 'Sertifiseringer',
        representerer: 'sertifiseringer',
        seleksjonstype: Seleksjonstype.FLERVALG,
        kilde: VerdigruppeSokKilde.JANZZ_SERTIFISERING
      }
    ]
  },
  {
    tiltakskode: Tiltakskode.FAG_OG_YRKESOPPLAERING,
    alternativer: [
      {
        type: KodeverkAlternativType.GRUPPE,
        id: null,
        visningsnavn: 'Utdanningsprogram',
        alternativer: [
          {
            type: KodeverkAlternativType.GRUPPE,
            id: '1390a963-e9b2-4677-bb87-243f4638b7a1',
            visningsnavn: 'Bygg- og anleggsteknikk',
            alternativer: [
              {
                type: KodeverkAlternativType.VERDIGRUPPE,
                id: null,
                visningsnavn: 'Lærefag',
                representerer: 'larefag',
                seleksjonstype: Seleksjonstype.FLERVALG,
                alternativer: [
                  {
                    id: '4248ce0c-ddea-4eec-8eba-5c9c33d2af66',
                    visningsnavn: 'Anleggsgartnerfaget',
                    valgt: false
                  },
                  {
                    id: '157ad180-20b7-48e9-8807-b0cfe002470f',
                    visningsnavn: 'Snekkerfaget',
                    valgt: false
                  },
                  {
                    id: '291287d3-8cdd-4f95-863a-6c6bdee822eb',
                    visningsnavn: 'Tømrerfaget',
                    valgt: false
                  }
                ]
              }
            ]
          },
          {
            type: KodeverkAlternativType.GRUPPE,
            id: 'f1bc4b14-56d6-4907-8fdf-48c982a4c759',
            visningsnavn: 'Elektro og datateknologi',
            alternativer: [
              {
                type: KodeverkAlternativType.VERDIGRUPPE,
                id: null,
                visningsnavn: 'Lærefag',
                representerer: 'larefag',
                seleksjonstype: Seleksjonstype.FLERVALG,
                alternativer: [
                  {
                    id: '12db8a0a-93cc-4aae-bd17-49ffe7ebd0a4',
                    visningsnavn: 'Automatiseringsfaget',
                    valgt: false
                  },
                  {
                    id: 'cf20e956-2048-45d1-b26f-af7331ffb392',
                    visningsnavn: 'Elektrikerfaget',
                    valgt: false
                  },
                  {
                    id: 'c347e158-08e8-495f-84ef-e837e7f615fe',
                    visningsnavn: 'Heismontørfaget',
                    valgt: false
                  }
                ]
              }
            ]
          },
          {
            type: KodeverkAlternativType.GRUPPE,
            id: 'a2b3c4d5-e6f7-4890-9abc-def012345678',
            visningsnavn: 'Helse- og oppvekstfag',
            alternativer: [
              {
                type: KodeverkAlternativType.VERDIGRUPPE,
                id: null,
                visningsnavn: 'Lærefag',
                representerer: 'larefag',
                seleksjonstype: Seleksjonstype.FLERVALG,
                alternativer: [
                  {
                    id: 'b3c4d5e6-f7a8-4901-9bcd-ef0123456789',
                    visningsnavn: 'Helsefagarbeiderfaget',
                    valgt: false
                  },
                  {
                    id: 'c4d5e6f7-a8b9-4012-9cde-f01234567890',
                    visningsnavn: 'Barne- og ungdomsarbeiderfaget',
                    valgt: false
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

export const mockSertifiseringer: KodeverkSertifiseringResponse = [
  { konseptId: 90999, label: 'Datakortet del 1' },
  { konseptId: 2, label: 'Datakortet del 2' },
  { konseptId: 3, label: 'Sertifisert zumba-instruktør' },
  { konseptId: 345, label: 'Godkjent jagerpilot' }
]
