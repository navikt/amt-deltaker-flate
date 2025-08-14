import { Deltaker } from '../../api/data/deltakerliste.ts'
import { HandlingValg } from '../../context-providers/HandlingContext.tsx'
import { lagDeltakerNavn } from '../../utils/utils.ts'

export const lagInfoTekst = (deltakere: Deltaker[], handling: HandlingValg) => {
  const handlingstekst = getHandlingsTekst(handling)
  const antallOppdaterte = deltakere.filter(
    (deltaker) => deltaker.feilkode === null
  ).length
  const antallValgte = deltakere.length
  const feiledeDeltakere = deltakere.filter(
    (deltaker) => deltaker.feilkode !== null
  )

  if (feiledeDeltakere.length > 0) {
    const navn = feiledeDeltakere
      .map((deltaker) => lagDeltakerNavn(deltaker))
      .join(', ')
    return `${antallOppdaterte} av ${antallValgte} deltakere ${handlingstekst}. ${navn} kunne ikke endres. Vennligst prøv igjen`
  } else {
    return `${antallOppdaterte} deltaker${antallOppdaterte === 1 ? '' : 'e'} ${handlingstekst}.`
  }
}

const getHandlingsTekst = (handling: HandlingValg) => {
  switch (handling) {
    case HandlingValg.SETT_PA_VENTELISTE:
      return 'ble satt på venteliste'
    case HandlingValg.DEL_DELTAKERE:
      return 'ble delt med arrangør'
    case HandlingValg.GI_AVSLAG:
      return 'fikk avslag'
    case HandlingValg.TILDEL_PLASS:
      return 'ble tildelt plass'
    default:
      throw Error(`Ikke støttet type ${handling}`)
  }
}
