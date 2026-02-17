import { Alert, BodyLong } from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  DeltakerStatusType,
  formatDateWithMonthName,
  hentTiltakEllerGjennomforingNavnHosArrangorTekst,
  isValidDate,
  Pameldingstype,
  Tiltakskode
} from 'deltaker-flate-common'
import { Oppstartstype } from '../model/deltaker.ts'

interface DeltakerStatusInfoTekstProps {
  tiltakskode: Tiltakskode
  deltakerlisteNavn: string
  statusType: DeltakerStatusType
  arrangorNavn: string
  oppstartsdato: string | null
  pameldingstype: Pameldingstype
  oppstartstype: Oppstartstype | null
  tiltaketsStartDato: Date | null
  erEnkeltplassUtenRammeavtale: boolean
}

export const skalViseDeltakerStatusInfoTekst = (status: DeltakerStatusType) => {
  return (
    status === DeltakerStatusType.VENTER_PA_OPPSTART ||
    status === DeltakerStatusType.DELTAR ||
    status === DeltakerStatusType.HAR_SLUTTET ||
    status === DeltakerStatusType.IKKE_AKTUELL ||
    status === DeltakerStatusType.VURDERES ||
    status === DeltakerStatusType.VENTELISTE ||
    status === DeltakerStatusType.SOKT_INN ||
    status === DeltakerStatusType.FULLFORT ||
    status === DeltakerStatusType.AVBRUTT
  )
}

const getInfoTekst = (
  kreverGodkjenning: boolean,
  status: DeltakerStatusType,
  tiltakOgStedTekst: string
) => {
  switch (status) {
    case DeltakerStatusType.VENTER_PA_OPPSTART:
      return `Du ${kreverGodkjenning ? 'har fått plass' : 'er meldt'} på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
    case DeltakerStatusType.DELTAR:
      return `Du deltar på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
    case DeltakerStatusType.HAR_SLUTTET:
      return `Du deltok på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
    case DeltakerStatusType.IKKE_AKTUELL:
      return kreverGodkjenning
        ? `Søknaden om ${tiltakOgStedTekst} er avslått.`
        : `${tiltakOgStedTekst} ble ikke aktuelt.`
    case DeltakerStatusType.VURDERES:
    case DeltakerStatusType.SOKT_INN:
      return `Du er søkt inn på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
    case DeltakerStatusType.VENTELISTE:
      return `Du er satt på venteliste for arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
    case DeltakerStatusType.FULLFORT:
    case DeltakerStatusType.AVBRUTT:
      return `Du deltok på ${tiltakOgStedTekst}.`
  }
}

const getHoyereUtdanningInfo = (statusType: DeltakerStatusType) => {
  if (
    !(
      statusType === DeltakerStatusType.SOKT_INN ||
      statusType === DeltakerStatusType.VENTER_PA_OPPSTART
    )
  ) {
    return null
  }

  const infoTekst =
    statusType === DeltakerStatusType.SOKT_INN
      ? 'Nav har søkt deg inn på tiltaket Høyere utdanning. Du må selv sende søknad til opplæringsstedet, som avgjør om du får plass på utdanningen.'
      : 'Nav har godkjent tiltaket Høyere utdanning. Du må selv sende søknad til opplæringsstedet, som avgjør om du får plass på utdanningen.'

  return (
    <Alert variant="info" className="mt-4" size="small">
      {infoTekst}
    </Alert>
  )
}

export const DeltakerStatusInfoTekst = ({
  tiltakskode,
  deltakerlisteNavn,
  statusType,
  arrangorNavn,
  oppstartsdato,
  pameldingstype,
  oppstartstype,
  tiltaketsStartDato,
  erEnkeltplassUtenRammeavtale
}: DeltakerStatusInfoTekstProps) => {
  if (tiltakskode === Tiltakskode.HOYERE_UTDANNING) {
    return getHoyereUtdanningInfo(statusType)
  }

  if (erEnkeltplassUtenRammeavtale) {
    return null
  }

  const harOppstartsDato = isValidDate(oppstartsdato)

  return (
    <>
      <BodyLong size="small" className="mt-2">
        {getInfoTekst(
          pameldingstype === Pameldingstype.TRENGER_GODKJENNING,
          statusType,
          hentTiltakEllerGjennomforingNavnHosArrangorTekst(
            tiltakskode,
            deltakerlisteNavn,
            arrangorNavn
          )
        )}
      </BodyLong>
      {!harOppstartsDato &&
        statusType === DeltakerStatusType.VENTER_PA_OPPSTART && (
          <Alert variant="info" className="mt-4" size="small">
            {getIngenStartDatoInfoTekst(
              tiltakskode,
              pameldingstype,
              oppstartstype,
              arrangorNavn,
              tiltaketsStartDato
            )}
          </Alert>
        )}
    </>
  )
}

const getIngenStartDatoInfoTekst = (
  tiltakskode: Tiltakskode,
  pameldingstype: Pameldingstype,
  oppstartstype: Oppstartstype | null,
  arrangorNavn: string,
  tiltaketsStartDato: Date | null
) => {
  if (pameldingstype === Pameldingstype.TRENGER_GODKJENNING) {
    if (!tiltaketsStartDato) {
      return 'Nav eller arrangøren tar kontakt med deg for å avtale din oppstart.'
    }
    const harKursetStartet = dayjs().isAfter(tiltaketsStartDato)
    const fellesOppstartText = `Kurset ${harKursetStartet ? 'startet' : 'starter'} ${formatDateWithMonthName(tiltaketsStartDato)}. `
    const baseText =
      'Nav eller arrangøren tar kontakt med deg for å avtale når du skal begynne.'
    return oppstartstype === Oppstartstype.FELLES
      ? fellesOppstartText + baseText
      : baseText
  }

  return tiltakskode === Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET
    ? `${arrangorNavn} avgjør om du tilbys plass. Ved tilbud om plass vil du bli ansatt. Når arrangøren har en ledig plass, vil de ta kontakt med deg for å avtale når du skal begynne.`
    : 'Nav eller arrangøren tar kontakt med deg for å avtale når du skal begynne.'
}
