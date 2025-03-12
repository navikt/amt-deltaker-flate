export const APP_ROUTE = `${import.meta.env.BASE_URL}gjennomforinger/:deltakerlisteId/deltakerliste`
export const DELTAKER_ROUTE = `${APP_ROUTE}/deltaker/:deltakerId`
export const INNGANG_AD_GRUPPE_ROUTE = `${APP_ROUTE}/ingen-ad-gruppe`
export const DELTAKERLISTE_STENGT_ROUTE = `${APP_ROUTE}/stengt`
export const IKKE_TILGANG_TIL_DELTAKERLISTE_ROUTE = `${APP_ROUTE}/ikke-tilgang`

export const getDeltakerlisteUrl = (deltakerlisteId: string): string => {
  return APP_ROUTE.replace(':deltakerlisteId', deltakerlisteId)
}

export const getIngangAdGruppeUrl = (deltakerlisteId: string): string => {
  return INNGANG_AD_GRUPPE_ROUTE.replace(':deltakerlisteId', deltakerlisteId)
}

export const getDeltakerlisteStengtUrl = (deltakerlisteId: string): string => {
  return DELTAKERLISTE_STENGT_ROUTE.replace(':deltakerlisteId', deltakerlisteId)
}

export const getIkkeTilgangTilDeltakerlisteUrl = (
  deltakerlisteId: string
): string => {
  return IKKE_TILGANG_TIL_DELTAKERLISTE_ROUTE.replace(
    ':deltakerlisteId',
    deltakerlisteId
  )
}

export const getDeltakerUrl = (
  deltakerlisteId: string,
  deltakerId: string
): string => {
  return DELTAKER_ROUTE.replace(':deltakerlisteId', deltakerlisteId).replace(
    ':deltakerId',
    deltakerId
  )
}
