import { DeltakerStatusType } from 'deltaker-flate-common'

export const deltakerVenterPaOppstartEllerDeltar = (
  statustype: DeltakerStatusType
): boolean => {
  return (
    statustype === DeltakerStatusType.VENTER_PA_OPPSTART ||
    statustype === DeltakerStatusType.DELTAR
  )
}

export const deltakerHarSluttetEllerFullfort = (
  statustype: DeltakerStatusType
): boolean => {
  return (
    statustype === DeltakerStatusType.HAR_SLUTTET ||
    statustype === DeltakerStatusType.FULLFORT ||
    statustype === DeltakerStatusType.AVBRUTT
  )
}

export const deltakerHarAvsluttendeStatus = (
  statustype: DeltakerStatusType
): boolean => {
  return (
    statustype === DeltakerStatusType.HAR_SLUTTET ||
    statustype === DeltakerStatusType.FULLFORT ||
    statustype === DeltakerStatusType.AVBRUTT ||
    statustype === DeltakerStatusType.IKKE_AKTUELL ||
    statustype === DeltakerStatusType.AVBRUTT_UTKAST ||
    statustype === DeltakerStatusType.FEILREGISTRERT
  )
}
