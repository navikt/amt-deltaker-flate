import {
  BodyLong,
  Button,
  GuidePanel,
  Heading,
  List,
  Link,
  Alert
} from '@navikt/ds-react'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { svg } from '../ikoner/nav-veileder'
import { EMDASH, hentTiltakNavnHosArrangørTekst } from '../utils/utils'
import { useParams } from 'react-router-dom'
import { DeferredFetchState, useDeferredFetch } from '../hooks/useDeferredFetch'
import { godkjennUtkast } from '../api/api'
import { VilIkkeGodkjenneExpansionCard } from '../components/VilIkkeGodkjenneExpansionCard'
import { useDeltakerContext } from '../DeltakerContext'
import { Tiltakstype } from 'deltaker-flate-model'
import { PERSONOPPLYSNINGER_URL } from '../utils/environment-utils'
import { UtkastHeader } from '../components/UtkastHeader.tsx'

export const UtkastPage = () => {
  const { deltaker, setDeltaker } = useDeltakerContext()
  const arrangorNavn = deltaker.deltakerliste.arrangorNavn
  const dagerIUkaText = deltaker.dagerPerUke
    ? `${deltaker.dagerPerUke} ${deltaker.dagerPerUke > 1 ? 'dager' : 'dag'} i uka`
    : ''

  const { deltakerId } = useParams()
  const {
    state,
    error,
    doFetch: doFetchGodkjennUtkast
  } = useDeferredFetch(godkjennUtkast)
  const handleGodkjennUtkast = () => {
    if (deltakerId) {
      doFetchGodkjennUtkast(deltakerId).then((oppdatertDeltaker) => {
        if (oppdatertDeltaker) setDeltaker(oppdatertDeltaker)
      })
    }
  }

  return (
    <div className="flex flex-col items-start">
      <Heading level="1" size="large">
        Utkast til påmelding
      </Heading>
      <UtkastHeader vedtaksinformasjon={deltaker.vedtaksinformasjon} />
      <GuidePanel poster illustration={svg} className="mt-4">
        <Heading level="2" size="small">
          Dette er et utkast til påmelding til{' '}
          {hentTiltakNavnHosArrangørTekst(
            deltaker.deltakerliste.tiltakstype,
            arrangorNavn
          )}
        </Heading>
        <BodyLong className="mt-2">
          Før vi sender dette til {arrangorNavn} vil vi gjerne at du leser
          gjennom. Hvis du godkjenner utkastet blir du meldt på, vedtak fattes
          og {arrangorNavn} mottar informasjon.
        </BodyLong>
      </GuidePanel>

      <Heading level="2" size="medium" className="mt-6">
        Hva er innholdet?
      </Heading>
      {deltaker.deltakelsesinnhold?.ledetekst && (
        <BodyLong size="small" className="mt-2">
          {deltaker.deltakelsesinnhold?.ledetekst}
        </BodyLong>
      )}

      {deltaker.deltakelsesinnhold?.innhold && (
        <List as="ul" size="small" className="mt-2">
          {deltaker.deltakelsesinnhold.innhold.map((innhold) => (
            <List.Item key={innhold.innholdskode}>
              {innhold.tekst}
              {innhold.beskrivelse ? `: ${innhold.beskrivelse}` : ''}
            </List.Item>
          ))}
        </List>
      )}

      <Heading level="2" size="medium" className="mt-6">
        Bakgrunnsinfo
      </Heading>
      <BodyLong size="small" className="mt-2">
        {deltaker.bakgrunnsinformasjon || EMDASH}
      </BodyLong>

      {(deltaker.deltakerliste.tiltakstype === Tiltakstype.ARBFORB ||
        deltaker.deltakerliste.tiltakstype === Tiltakstype.VASV) && (
        <>
          <Heading level="2" size="medium" className="mt-6">
            Deltakelsesmengde
          </Heading>
          <BodyLong size="small" className="mt-2">
            {`${deltaker.deltakelsesprosent ?? 100}\u00A0% ${dagerIUkaText}`}
          </BodyLong>
        </>
      )}

      <Heading level="2" size="medium" className="mt-6">
        Kontaktinformasjon
      </Heading>
      <BodyLong size="small" className="mt-2">
        NAV samarbeider med {arrangorNavn}. Arrangøren behandler
        personopplysninger på vegne av NAV.
      </BodyLong>
      <List as="ul" size="small" className="mt-2">
        <List.Item>Navn og fødselsnummer</List.Item>
        <List.Item>Telefonnummer og e-postadresse</List.Item>
        {deltaker.adresseDelesMedArrangor && <List.Item>Adresse</List.Item>}
      </List>
      <Link href={PERSONOPPLYSNINGER_URL} className="text-base">
        Se her hvilke opplysninger NAV har om deg.
      </Link>

      <Heading level="2" size="medium" className="mt-6">
        Kan informasjonen deles til {arrangorNavn}?
      </Heading>
      <Button
        variant="primary"
        onClick={handleGodkjennUtkast}
        icon={<ThumbUpIcon aria-hidden />}
        className="mt-4"
        loading={state === DeferredFetchState.LOADING}
      >
        Ja, det ser greit ut
      </Button>
      {error && (
        <Alert variant="error" className="mt-4">
          Det skjedde en feil ved godkjenning av utkastet. Prøv igjen senere
        </Alert>
      )}

      <VilIkkeGodkjenneExpansionCard
        arrangorNavn={arrangorNavn}
        className="mt-6"
      />
    </div>
  )
}
