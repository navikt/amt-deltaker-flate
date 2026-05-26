import {
  KodeverkAlternativType,
  KodeverkContainer,
  KodeverkGruppe
} from '../api/data/kodeverk'

/**
 * Henter alle verdi-IDer fra en container rekursivt (uavhengig av valgt-status).
 */
export const getAlleVerdiIder = (
  alternativer: KodeverkContainer[]
): Set<string> => {
  const ider = new Set<string>()
  for (const a of alternativer) {
    if (a.type === KodeverkAlternativType.VERDIGRUPPE) {
      for (const v of a.alternativer) ider.add(v.id)
    } else if (a.type === KodeverkAlternativType.GRUPPE) {
      for (const id of getAlleVerdiIder(a.alternativer)) ider.add(id)
    }
  }
  return ider
}

/**
 * Henter alle valgte verdi-IDer fra kodeverket rekursivt.
 */
export const getValgteVerdier = (
  alternativer: KodeverkContainer[]
): string[] => {
  return alternativer.flatMap((a) => {
    if (a.type === KodeverkAlternativType.VERDIGRUPPE) {
      return a.alternativer.filter((v) => v.valgt).map((v) => v.id)
    }
    if (a.type === KodeverkAlternativType.GRUPPE) {
      return getValgteVerdier(a.alternativer)
    }
    return []
  })
}

/**
 * Finner IDen til det første alternativet i en Gruppe som inneholder valgte verdier.
 */
export const finnAlternativMedValgteVerdier = (
  gruppe: KodeverkGruppe
): string | null => {
  for (const a of gruppe.alternativer) {
    if (
      a.type === KodeverkAlternativType.VERDIGRUPPE &&
      a.alternativer.some((v) => v.valgt)
    ) {
      return a.id ?? a.visningsnavn
    }
    if (a.type === KodeverkAlternativType.GRUPPE) {
      const harValgte = getValgteVerdier(a.alternativer).length > 0
      if (harValgte) return a.id ?? a.visningsnavn
    }
  }
  return null
}
