import { KodeverkAlternativType, KodeverkContainer } from '../api/data/kodeverk'
import { FlattKodeverk, OpplaringRepresenterer } from 'deltaker-flate-common'

export const getValgteVerdier = (kodeverkValg: FlattKodeverk | null) => {
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
  kodeverkValg: FlattKodeverk | null
) => {
  return (
    kodeverkValg?.valgteSertifiseringer.map((e) => ({
      id: e.id,
      navn: e.navn
    })) ?? []
  )
}

/**
 * Henter alle valgte verdi-IDer fra kodeverket.
 */
export const getValgteVerdier2 = (alternativer: KodeverkContainer[]) => {
  return alternativer.flatMap((a) => {
    if (a.type === KodeverkAlternativType.VERDIGRUPPE) {
      const valgteIder = a.alternativer.filter((v) => v.valgt).map((v) => v.id)

      return valgteIder.length > 0
        ? [
            {
              representerer: a.representerer,
              valgteIder
            }
          ]
        : []
    }
    if (a.type === KodeverkAlternativType.UTDANNING_GRUPPE) {
      const valgtUtdanning = a.utdanninger.filter((u) => u.valgt)

      const valgteLarefag = valgtUtdanning.flatMap((u) =>
        u.larefag.alternativer.filter((v) => v.valgt).map((v) => v.id)
      )

      return [
        {
          representerer: OpplaringRepresenterer.UTDANNINGSPROGRAM_ID,
          valgteIder: valgtUtdanning.map((u) => u.id)
        },
        {
          representerer: OpplaringRepresenterer.LAREFAG,
          valgteIder: valgteLarefag
        }
      ].filter((valg) => valg.valgteIder.length > 0)
    }
    return []
  })
}
