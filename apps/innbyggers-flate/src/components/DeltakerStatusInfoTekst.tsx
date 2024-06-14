import { Alert, BodyLong } from '@navikt/ds-react'
import { DeltakerStatusType, isValidDate } from 'deltaker-flate-common'

interface DeltakerStatusInfoTekstProps {
  statusType: DeltakerStatusType
  tiltakOgStedTekst: string
  oppstartsdato: string | null
}

const getInfoTekst = (
  status: DeltakerStatusType,
  tiltakOgStedTekst: string
) => {
  switch (status) {
    case DeltakerStatusType.VENTER_PA_OPPSTART:
      return `Du er meldt på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}.`
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
  const harOppstartsDato = isValidDate(oppstartsdato)
  return (
    <>
      <BodyLong size="small" className="mt-4">
        {getInfoTekst(statusType, tiltakOgStedTekst)}
      </BodyLong>
      {!harOppstartsDato && (
        <Alert variant="info" className="mt-4" size="small">
          Når arrangøren har en ledig plass så vil de ta kontakt med deg for å
          avtale oppstart.
        </Alert>
      )}
    </>
  )
}
