import { Alert, BodyLong, Button, Heading } from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakelseInnhold,
  PrisOgBetaling,
  UtkastHeader,
  VeilederSnakkeboble,
  formatDateFromString,
  hentTiltakHosArrangorIngressTekst,
  hentTiltakHosArrangorTittel,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useParams } from 'react-router-dom'
import { useDeltakerContext } from '../DeltakerContext'
import { godkjennUtkast } from '../api/api'

export const UtkastEnkeltplassPage = () => {
  const { deltaker, setDeltaker, setShowSuccessMessage } = useDeltakerContext()
  const deltakerliste = deltaker.deltakerliste

  const tiltakNavnHosArrangorTekst = hentTiltakHosArrangorTittel(
    deltakerliste.tiltakskode,
    deltakerliste.arrangorNavn,
    deltakerliste.opplaringKategoriseringValg
  )
  const ingressTekst = hentTiltakHosArrangorIngressTekst(
    deltakerliste.tiltakskode,
    deltakerliste.deltakerlisteNavn,
    deltakerliste.arrangorNavn,
    deltakerliste.opplaringKategoriseringValg
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
        {tiltakNavnHosArrangorTekst}
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
        arrangorNavn={deltakerliste.arrangorNavn}
        tiltakskode={deltakerliste.tiltakskode}
        erEnkeltplass={deltakerliste.erEnkeltplass}
        tiltaksnavnHosArrangor={ingressTekst}
      />

      <BodyLong size="small" className="mt-8 whitespace-pre-wrap">
        <b>Dato:</b> {formatDateFromString(deltaker.startdato)} -{' '}
        {formatDateFromString(deltaker.sluttdato)}
      </BodyLong>

      <DeltakelseInnhold
        tiltakskode={deltakerliste.tiltakskode}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
        kodeverk={deltaker.deltakerliste.opplaringKategoriseringValg}
        heading={
          <Heading level="3" size="medium" className="mt-8">
            Dette er innholdet
          </Heading>
        }
      />

      <PrisOgBetaling
        prisinformasjon={deltaker.deltakerliste.prisinformasjon}
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
