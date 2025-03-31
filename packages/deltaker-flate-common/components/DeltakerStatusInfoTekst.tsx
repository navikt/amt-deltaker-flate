import { Alert, BodyLong } from '@navikt/ds-react'
import {
  DeltakerStatusType,
  getTiltakstypeDisplayText,
  isValidDate,
  ArenaTiltakskode,
  Oppstartstype
} from 'deltaker-flate-common'

interface DeltakerStatusInfoTekstProps {
  tiltakstype: ArenaTiltakskode
  statusType: DeltakerStatusType
  arrangorNavn: string
  oppstartsdato: string | null
  oppstartstype: Oppstartstype
}

export const skalViseDeltakerStatusInfoTekst = (status: DeltakerStatusType) => {
  return (
    status === DeltakerStatusType.VENTER_PA_OPPSTART ||
    status === DeltakerStatusType.DELTAR ||
    status === DeltakerStatusType.HAR_SLUTTET ||
    status === DeltakerStatusType.IKKE_AKTUELL ||
    status === DeltakerStatusType.VURDERES ||
    status === DeltakerStatusType.VENTELISTE ||
    status === DeltakerStatusType.SOKT_INN
  )
}

const getInfoTekst = (
  erFellesOppstart: boolean,
  status: DeltakerStatusType,
  tiltakOgStedTekst: string
) => {
  switch (status) {
    case DeltakerStatusType.VENTER_PA_OPPSTART:
      return `Du ${erFellesOppstart ? 'har fått plass' : 'er meldt'} på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
    case DeltakerStatusType.DELTAR:
      return `Du deltar på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
    case DeltakerStatusType.HAR_SLUTTET:
      return `Du deltok på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
    case DeltakerStatusType.IKKE_AKTUELL:
      return erFellesOppstart
        ? `Søknaden om ${tiltakOgStedTekst} er avslått.`
        : `${tiltakOgStedTekst} ble ikke aktuelt.`
    case DeltakerStatusType.VURDERES:
    case DeltakerStatusType.SOKT_INN:
      return `Du er søkt inn på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
    case DeltakerStatusType.VENTELISTE:
      return `Du er satt på venteliste for ${tiltakOgStedTekst}.`
  }
}

export const DeltakerStatusInfoTekst = ({
  tiltakstype,
  statusType,
  arrangorNavn,
  oppstartsdato,
  oppstartstype
}: DeltakerStatusInfoTekstProps) => {
  const harOppstartsDato = isValidDate(oppstartsdato)
  const tiltakNavn = getTiltakstypeDisplayText(tiltakstype)

  return (
    <>
      <BodyLong size="small" className="mt-4">
        {getInfoTekst(
          oppstartstype === Oppstartstype.FELLES,
          statusType,
          `${tiltakNavn} hos ${arrangorNavn}`
        )}
      </BodyLong>
      {!harOppstartsDato &&
        statusType === DeltakerStatusType.VENTER_PA_OPPSTART && (
          <Alert variant="info" className="mt-4" size="small">
            {tiltakstype === ArenaTiltakskode.VASV
              ? `${arrangorNavn} avgjør om du tilbys plass. Ved tilbud om plass vil du bli ansatt. Når arrangøren har en ledig plass, vil de ta kontakt med deg for å avtale oppstart.`
              : 'Når arrangøren har en ledig plass så vil de ta kontakt med deg for å avtale oppstart.'}
          </Alert>
        )}
    </>
  )
}
