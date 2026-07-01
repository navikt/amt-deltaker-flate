import { OpplaringKategorisering } from 'deltaker-flate-common'

export const getValgteVerdier = (
  kodeverkValg: OpplaringKategorisering | null
) => {
  return (
    kodeverkValg?.valgteKategoriseringer
      .filter((e) => e.valgteElementer.length > 0)
      .map((e) => ({
        representerer: e.type,
        valgteIder: e.valgteElementer.map((v) => v.id)
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
