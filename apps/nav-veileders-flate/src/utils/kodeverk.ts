import { OpplaringKategorisering } from 'deltaker-flate-common'

export const getValgteVerdier = (
  kodeverkValg: OpplaringKategorisering | null
) => {
  return (
    kodeverkValg?.valgteKategoriseringer
      .filter((e) => e.valg.length > 0)
      .map((e) => ({
        representerer: e.representerer,
        valgteIder: e.valg.map((v) => v.id)
      })) ?? []
  )
}

export const getValgteSertifiseringer = (
  kodeverkValg: OpplaringKategorisering | null
) => {
  return (
    kodeverkValg?.valgteSertifiseringer.map((e) => ({
      id: e.id,
      navn: e.navn
    })) ?? []
  )
}
