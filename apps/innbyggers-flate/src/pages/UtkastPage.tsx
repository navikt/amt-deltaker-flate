import {
  Alert,
  BodyLong,
  Button,
  ConfirmationPanel,
  GuidePanel,
  Heading,
  Link,
  List
} from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakelseInnhold,
  EMDASH,
  PERSONOPPLYSNINGER_URL,
  ArenaTiltakskode,
  UtkastHeader,
  deltakerprosentText,
  hentTiltakNavnHosArrangorTekst,
  useDeferredFetch,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDeltakerContext } from '../DeltakerContext'
import { godkjennUtkast } from '../api/api'
import { svg } from '../ikoner/nav-veileder'
import { DIALOG_URL } from '../utils/environment-utils'

export const UtkastPage = () => {
  const { deltaker, setDeltaker, setShowSuccessMessage } = useDeltakerContext()
  const [godatt, setGodTatt] = useState(false)
  const [godattError, setGodTattError] = useState(false)

  const arrangorNavn = deltaker.deltakerliste.arrangorNavn
  const navnHosArrangorTekst = hentTiltakNavnHosArrangorTekst(
    deltaker.deltakerliste.tiltakstype,
    arrangorNavn
  )

  const { deltakerId } = useParams()
  const {
    state,
    error,
    doFetch: doFetchGodkjennUtkast
  } = useDeferredFetch(godkjennUtkast)

  const handleGodkjennUtkast = () => {
    if (!godatt) {
      setGodTattError(true)
    } else if (deltakerId) {
      doFetchGodkjennUtkast(deltakerId).then((oppdatertDeltaker) => {
        if (oppdatertDeltaker) {
          setDeltaker(oppdatertDeltaker)
          setShowSuccessMessage(true)
        }
      })
    }
  }

  return (
    <div className="flex flex-col items-start mb-8">
      <Heading level="1" size="xlarge">
        {navnHosArrangorTekst}
      </Heading>
      <Heading
        level="2"
        size="large"
        className="mt-6"
        data-testid="heading_utkast"
      >
        Utkast til påmelding
      </Heading>
      <UtkastHeader
        vedtaksinformasjon={deltaker.vedtaksinformasjon}
        deltakerStatus={deltaker.status}
      />
      <GuidePanel poster illustration={svg}>
        <Heading level="3" size="small">
          {`Dette er et utkast til påmelding til ${navnHosArrangorTekst}`}
        </Heading>
        <BodyLong className="mt-2">
          Før vi sender dette til {arrangorNavn} vil vi gjerne at du leser
          gjennom. Hvis du godkjenner utkastet blir du meldt på, vedtaket fattes
          og {arrangorNavn} mottar informasjon.
        </BodyLong>
      </GuidePanel>

      <DeltakelseInnhold
        tiltakstype={deltaker.deltakerliste.tiltakstype}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
        heading={
          <Heading level="3" size="medium" className="mt-6 mb-2">
            Dette er innholdet
          </Heading>
        }
        listClassName="mt-2"
      />

      {deltaker.bakgrunnsinformasjon && (
        <>
          <Heading level="3" size="medium" className="mt-6">
            Bakgrunnsinfo
          </Heading>
          <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
            {deltaker.bakgrunnsinformasjon || EMDASH}
          </BodyLong>
        </>
      )}

      {visDeltakelsesmengde(deltaker.deltakerliste.tiltakstype) && (
        <>
          <Heading level="3" size="medium" className="mt-6">
            Deltakelsesmengde
          </Heading>
          <BodyLong size="small" className="mt-2">
            {deltakerprosentText(
              deltaker.deltakelsesprosent,
              deltaker.dagerPerUke
            )}
          </BodyLong>
        </>
      )}

      <Heading level="3" size="medium" className="mt-6">
        Kontaktinformasjon
      </Heading>
      <BodyLong size="small" className="mt-2">
        Nav samarbeider med {arrangorNavn}. Arrangøren behandler
        personopplysninger på vegne av Nav.
      </BodyLong>
      <List as="ul" size="small" className="-mt-1 -mb-2">
        <List.Item className="mt-2 whitespace-pre-wrap">
          Navn og fødselsnummer
        </List.Item>
        <List.Item className="mt-2 whitespace-pre-wrap">
          Telefonnummer og e-postadresse
        </List.Item>
        {deltaker.adresseDelesMedArrangor &&
          deltaker.deltakerliste.tiltakstype !==
            ArenaTiltakskode.DIGIOPPARB && (
            <List.Item className="mt-2 whitespace-pre-wrap">Adresse</List.Item>
          )}
      </List>
      <Link href={PERSONOPPLYSNINGER_URL} className="text-base">
        Se her hvilke opplysninger Nav har om deg.
      </Link>

      <ConfirmationPanel
        className="mt-6"
        checked={godatt}
        label="Ja, det ser greit ut."
        onChange={() => {
          setGodTattError(false)
          setGodTatt((x) => !x)
        }}
        size="small"
        error={godattError && 'Du må si ja for å kunne godkjenne utkastet'}
      >
        <Heading level="3" size="xsmall">
          {`Kan informasjonen deles til ${arrangorNavn}?`}
        </Heading>
        <BodyLong className="mt-4">
          Hvis du har et spørsmål, innspill eller ikke ønsker at dette deles,{' '}
          <Link href={DIALOG_URL} inlineText>
            så send en melding til Nav-veilederen din her.
          </Link>
        </BodyLong>
      </ConfirmationPanel>

      <Button
        variant="primary"
        onClick={handleGodkjennUtkast}
        className="mt-4"
        loading={state === DeferredFetchState.LOADING}
        data-testid="godkjenn_utkast"
      >
        Godkjenn utkast
      </Button>
      <div aria-live="polite">
        {error && (
          <Alert variant="error" className="mt-4">
            Det skjedde en feil ved godkjenning av utkastet. Prøv igjen senere
          </Alert>
        )}
      </div>

      <Alert inline variant="info" className="mt-4">
        Når du godkjenner utkastet blir du meldt på, vedtaket fattes og{' '}
        {arrangorNavn} mottar informasjonen.
      </Alert>
    </div>
  )
}
