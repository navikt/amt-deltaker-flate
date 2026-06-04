import { FlattKodeverk, OpplaringRepresenterer } from '../model/kodeverk'

/**
 * Henter første valgnavn for en gitt representør fra flatt kodeverk.
 * Brukes til å hente f.eks. kursnavn, bransje, osv.
 *
 * @param kodeverk Det flate kodeverket
 * @param representerer Hvilken type kodeverk man søker etter
 * @returns Visningsnavn på første valg, eller undefined hvis ikke funnet
 */
export const getKodeverkValgNavn = (
  kodeverk: FlattKodeverk | undefined | null,
  representerer: OpplaringRepresenterer
): string | undefined => {
  return kodeverk?.eleenter.find(
    (element) => element.representerer === representerer
  )?.valg[0]?.visningsnavn
}
