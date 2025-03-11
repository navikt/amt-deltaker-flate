export const APP_ROUTE = `${import.meta.env.BASE_URL}gjennomforinger/:deltakerlisteId/deltakerliste`
export const DELTAKER_ROUTE = `${APP_ROUTE}/deltaker/:deltakerId`

export const getDeltakerlisteUrl = (deltakerlisteId: string): string => {
  return APP_ROUTE.replace(':deltakerlisteId', deltakerlisteId)
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
