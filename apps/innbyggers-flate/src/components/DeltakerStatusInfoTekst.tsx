import { BodyLong } from '@navikt/ds-react'
import { DeltakerStatusType, EMDASH } from 'deltaker-flate-common'

interface DeltakerStatusInfoTekstProps {
  statusType: DeltakerStatusType
  tiltakOgStedTekst: string
  oppstartsdato: string | null
}

const getInfoTekst = (
  status: DeltakerStatusType,
  tiltakOgStedTekst: string,
  harOppstartsdato: boolean
) => {
  switch (status) {
    case DeltakerStatusType.VENTER_PA_OPPSTART:
      if (harOppstartsdato) {
        return `Du er meldt på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
      } else {
        return `Du er meldt på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}. Når arrangøren har en ledig plass så vil de ta kontakt med deg for å avtale oppstart.`
      }
    case DeltakerStatusType.DELTAR:
      return `Du deltar på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
    case DeltakerStatusType.HAR_SLUTTET:
      return `Du deltok på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
    case DeltakerStatusType.IKKE_AKTUELL:
      return `${tiltakOgStedTekst} ble ikke aktuelt.`
  }
}

export const DeltakerStatusInfoTekst = ({
  statusType,
  tiltakOgStedTekst,
  oppstartsdato
}: DeltakerStatusInfoTekstProps) => {
  return (
    <BodyLong size="small" className="mt-4">
      {getInfoTekst(
        statusType,
        tiltakOgStedTekst,
        oppstartsdato !== null && oppstartsdato !== EMDASH
      )}
    </BodyLong>
  )
}
