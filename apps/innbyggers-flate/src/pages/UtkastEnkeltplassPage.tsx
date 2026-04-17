import { Alert, BodyLong, Button, Heading } from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakelseInnhold,
  UtkastHeader,
  hentTiltakEllerGjennomforingNavnHosArrangorTekst,
  hentTiltakNavnHosArrangorTekst,
  useDeferredFetch,
  VeilederSnakkeboble,
  formatDateFromString,
  PrisOgBetaling
} from 'deltaker-flate-common'
import { useParams } from 'react-router-dom'
import { useDeltakerContext } from '../DeltakerContext'
import { godkjennUtkast } from '../api/api'

export const UtkastEnkeltplassPage = () => {
  const { deltaker, setDeltaker, setShowSuccessMessage } = useDeltakerContext()
  const deltakerliste = deltaker.deltakerliste

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
    if (deltakerId) {
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
        {tiltakOgStedTekst}
      </Heading>
      <Heading
        level="2"
        size="large"
        className="mt-8"
        data-testid="heading_utkast"
      >
        Utkast til søknad
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

      <BodyLong size="small" className="mt-8 whitespace-pre-wrap">
        <b>Dato:</b> {formatDateFromString(deltaker.startdato)} -{' '}
        {formatDateFromString(deltaker.sluttdato)}
      </BodyLong>

      <DeltakelseInnhold
        tiltakskode={deltakerliste.tiltakskode}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
        heading={
          <Heading level="3" size="medium" className="mt-8 mb-2">
            Dette er innholdet
          </Heading>
        }
        listClassName="mt-2"
      />

      <PrisOgBetaling
        prisinformasjon={deltaker.prisinformasjon}
        headinglevel="3"
        className="mt-8"
      />

      <Button
        variant="primary"
        onClick={handleGodkjennUtkast}
        className="mt-8"
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
        Når du godkjenner utkastet blir søknaden sendt inn.
      </Alert>
    </div>
  )
}
