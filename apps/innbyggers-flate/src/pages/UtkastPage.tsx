import {
  Alert,
  BodyLong,
  Button,
  ConfirmationPanel,
  Heading,
  Link
} from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakelseInnhold,
  EMDASH,
  OmKurset,
  Oppmotested,
  UtkastHeader,
  deltakerprosentText,
  harAdresse,
  harBakgrunnsinfo,
  harInnhold,
  hentTiltakEllerGjennomforingNavnHosArrangorTekst,
  hentTiltakNavnHosArrangorTekst,
  kanDeleDeltakerMedArrangorForVurdering,
  kreverGodkjenningForPamelding,
  useDeferredFetch,
  visDeltakelsesmengde,
  VeilederSnakkeboble
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDeltakerContext } from '../DeltakerContext'
import { godkjennUtkast } from '../api/api'
import { DIALOG_URL } from '../utils/environment-utils'
import { DetteDelesMedArrangor } from '../components/DetteDelesMedArrangor.tsx'

export const UtkastPage = () => {
  const { deltaker, setDeltaker, setShowSuccessMessage } = useDeltakerContext()
  const [godatt, setGodTatt] = useState(false)
  const [godattError, setGodTattError] = useState(false)
  const deltakerliste = deltaker.deltakerliste
  const erUtkastTilSoknad = kreverGodkjenningForPamelding(
    deltakerliste.pameldingstype
  )
  const arrangorNavn = deltakerliste.arrangorNavn
  const navnHosArrangorTekst = hentTiltakEllerGjennomforingNavnHosArrangorTekst(
    deltakerliste.tiltakskode,
    deltakerliste.deltakerlisteNavn,
    arrangorNavn
  )
  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    deltakerliste.tiltakskode,
    deltakerliste.arrangorNavn
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

  const tiltakskode = deltakerliste.tiltakskode
  const skalViseAdresse =
    deltaker.adresseDelesMedArrangor && harAdresse(tiltakskode)
  const visInnholdOgBakgrunnsinfo =
    harBakgrunnsinfo(tiltakskode) || harInnhold(tiltakskode)
  const kanDeleDeltakerMedArrangor = kanDeleDeltakerMedArrangorForVurdering(
    deltakerliste.pameldingstype,
    deltakerliste.tiltakskode,
    deltakerliste.erEnkeltplass
  )

  return (
    <div className="flex flex-col items-start mb-8">
      <Heading level="1" size="xlarge">
        {tiltakOgStedTekst}
      </Heading>
      <Heading
        level="2"
        size="large"
        className="mt-6"
        data-testid="heading_utkast"
      >
        {erUtkastTilSoknad ? 'Utkast til søknad' : 'Utkast til påmelding'}
      </Heading>
      <UtkastHeader
        vedtaksinformasjon={deltaker.vedtaksinformasjon}
        deltakerStatus={deltaker.status}
      />
      <VeilederSnakkeboble
        pameldingstype={deltakerliste.pameldingstype}
        arrangorNavn={navnHosArrangorTekst}
        tiltakskode={deltakerliste.tiltakskode}
        erEnkeltplass={deltakerliste.erEnkeltplass}
        deltakerlisteNavn={deltakerliste.deltakerlisteNavn}
      />

      <OmKurset
        tiltakskode={deltakerliste.tiltakskode}
        statusType={deltaker.status.type}
        oppstartstype={deltakerliste.oppstartstype}
        pameldingstype={deltakerliste.pameldingstype}
        erEnkeltplass={deltakerliste.erEnkeltplass}
        startdato={deltakerliste.startdato}
        sluttdato={deltakerliste.sluttdato}
        className="mt-6"
      />

      <Oppmotested
        oppmoteSted={deltakerliste.oppmoteSted}
        statusType={deltaker.status.type}
        className="mt-6"
      />

      <DeltakelseInnhold
        tiltakskode={deltakerliste.tiltakskode}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
        heading={
          <Heading level="3" size="medium" className="mt-6 mb-2">
            Dette er innholdet
          </Heading>
        }
        listClassName="mt-2"
      />

      {harBakgrunnsinfo(tiltakskode) && deltaker.bakgrunnsinformasjon && (
        <>
          <Heading level="3" size="medium" className="mt-6">
            Bakgrunnsinfo
          </Heading>
          <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
            {deltaker.bakgrunnsinformasjon || EMDASH}
          </BodyLong>
        </>
      )}

      {visDeltakelsesmengde(deltakerliste.tiltakskode) && (
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

      <DetteDelesMedArrangor
        kanDeleDeltakerMedArrangor={kanDeleDeltakerMedArrangor}
        arrangorNavn={navnHosArrangorTekst}
        skalViseAdresse={skalViseAdresse}
        visInnholdOgBakgrunnsinfo={visInnholdOgBakgrunnsinfo}
      />

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
          Hvis du har et spørsmål, innspill eller ikke ønsker at dette deles, så{' '}
          <Link href={DIALOG_URL} inlineText>
            send en melding til Nav-veilederen din her.
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
            Det skjedde en feil ved godkjenning av utkastet. Prøv igjen senere.
          </Alert>
        )}
      </div>

      <Alert inline variant="info" className="mt-4">
        {erUtkastTilSoknad
          ? 'Når du godkjenner utkastet blir søknaden sendt inn.'
          : `Når du godkjenner utkastet blir du meldt på, vedtaket fattes og ${arrangorNavn} mottar informasjonen.`}
      </Alert>
    </div>
  )
}
