import { KodeverkAlternativType, KodeverkContainer } from '../api/data/kodeverk'
import { OpplaringRepresenterer } from 'deltaker-flate-common'

/**
 * Henter alle valgte verdi-IDer fra kodeverket.
 */
export const getValgteVerdier = (alternativer: KodeverkContainer[]) => {
  return alternativer.flatMap((a) => {
    if (a.type === KodeverkAlternativType.VERDIGRUPPE) {
      return [
        {
          representerer: a.representerer,
          valgteIder: a.alternativer.filter((v) => v.valgt).map((v) => v.id)
        }
      ]
    }
    if (a.type === KodeverkAlternativType.UTDANNING_GRUPPE) {
      const valgteUtdanninger = a.utdanninger
        .filter((u) => u.larefag.alternativer.some((v) => v.valgt))
        .map((u) => u.id)

      const valgteLarefag = a.utdanninger.flatMap((u) =>
        u.larefag.alternativer.filter((v) => v.valgt).map((v) => v.id)
      )

      return [
        {
          representerer: OpplaringRepresenterer.UTDANNINGSPROGRAM_ID,
          valgteIder: valgteUtdanninger
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
