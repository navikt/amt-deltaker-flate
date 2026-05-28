import { KodeverkAlternativType, KodeverkContainer } from '../api/data/kodeverk'

/**
 * Henter alle valgte verdi-IDer fra kodeverket.
 */
export const getValgteVerdier = (
  alternativer: KodeverkContainer[]
): string[] => {
  return alternativer.flatMap((a) => {
    if (a.type === KodeverkAlternativType.VERDIGRUPPE) {
      return a.alternativer.filter((v) => v.valgt).map((v) => v.id)
    }
    if (a.type === KodeverkAlternativType.UTDANNING_GRUPPE) {
      return a.utdanninger.flatMap((u) =>
        u.larefag.alternativer.filter((v) => v.valgt).map((v) => v.id)
      )
    }
    return []
  })
}
