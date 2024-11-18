import { Alert, BodyLong } from '@navikt/ds-react'
import {
  DeltakerStatusType,
  getTiltakstypeDisplayText,
  isValidDate,
  Tiltakstype
} from 'deltaker-flate-common'

interface DeltakerStatusInfoTekstProps {
  tiltakstype: Tiltakstype
  statusType: DeltakerStatusType
  arrangorNavn: string
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
  tiltakstype,
  statusType,
  arrangorNavn,
  oppstartsdato
}: DeltakerStatusInfoTekstProps) => {
  const harOppstartsDato = isValidDate(oppstartsdato)
  const tiltakNavn = getTiltakstypeDisplayText(tiltakstype)

  return (
    <>
      <BodyLong size="small" className="mt-4">
        {getInfoTekst(statusType, `${tiltakNavn} hos ${arrangorNavn}`)}
      </BodyLong>
      {!harOppstartsDato &&
        statusType === DeltakerStatusType.VENTER_PA_OPPSTART && (
          <Alert variant="info" className="mt-4" size="small">
            {tiltakstype === Tiltakstype.VASV
              ? `${arrangorNavn} avgjør om du tilbys plass. Ved tilbud om plass vil du bli ansatt. Når arrangøren har en ledig plass, vil de ta kontakt med deg for å avtale oppstart.`
              : 'Når arrangøren har en ledig plass så vil de ta kontakt med deg for å avtale oppstart.'}
          </Alert>
        )}
    </>
  )
}
