import { FlattKodeverk, Tiltakskode } from 'deltaker-flate-common'

export const createMockFlatKodeverk = (): FlattKodeverk => {
  return {
    tiltakskode: Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING,
    tittel: 'Butikk- og salgsarbeid',
    valg: ['B - Personbil', 'C - Lastebil'],
    valgteKodeverkIder: [
      '14886bad-a495-420a-9bae-d33e2d88041a',
      '79d1a970-e8f0-4ecd-8d5e-e7c8d5f3394c'
    ],
    valgteSertifiseringer: [{ id: 3, navn: 'Sertifisert zumba-instruktør' }]
  }
}
