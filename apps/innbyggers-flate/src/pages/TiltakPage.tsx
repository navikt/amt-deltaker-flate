import { ChatElipsisIcon } from '@navikt/aksel-icons'
import {
  Alert,
  BodyLong,
  BodyShort,
  HStack,
  Heading,
  Label,
  Link,
  LinkPanel
} from '@navikt/ds-react'
import {
  DeltakelseInnhold,
  DeltakerStatusInfoTekst,
  DeltakerStatusTag,
  DeltakerStatusType,
  EMDASH,
  HvaDelesMedArrangor,
  VedtakInfo,
  SeEndringer,
  deltakerprosentText,
  formatDateFromString,
  getDeltakerStatusAarsakText,
  hentTiltakNavnHosArrangorTekst,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { useEffect } from 'react'
import { useDeltakerContext } from '../DeltakerContext.tsx'
import { getHistorikk } from '../api/api.ts'
import { AktiveForslag } from '../components/AktiveForslag.tsx'
import { DIALOG_URL } from '../utils/environment-utils.ts'
import { useSearchParams } from 'react-router-dom'

const skalViseDeltakerStatusInfoTekst = (status: DeltakerStatusType) => {
  return (
    status === DeltakerStatusType.VENTER_PA_OPPSTART ||
    status === DeltakerStatusType.DELTAR ||
    status === DeltakerStatusType.HAR_SLUTTET ||
    status === DeltakerStatusType.IKKE_AKTUELL
  )
}

export const TiltakPage = () => {
  const { deltaker, showSuccessMessage } = useDeltakerContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const visEndringer = searchParams.get('vis_endringer') === ''

  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    deltaker.deltakerliste.tiltakstype,
    deltaker.deltakerliste.arrangorNavn
  )
  const skalViseDato =
    deltaker.status.type !== DeltakerStatusType.IKKE_AKTUELL &&
    deltaker.status.type !== DeltakerStatusType.AVBRUTT_UTKAST
  const bakgrunnsinformasjon =
    deltaker.bakgrunnsinformasjon && deltaker.bakgrunnsinformasjon.length > 0
      ? deltaker.bakgrunnsinformasjon
      : EMDASH

  let dato = EMDASH
  if (
    deltaker.startdato &&
    deltaker.sluttdato &&
    deltaker.startdato !== EMDASH &&
    deltaker.sluttdato !== EMDASH
  ) {
    dato = `${formatDateFromString(deltaker.startdato)} - ${formatDateFromString(deltaker.sluttdato)}`
  } else if (deltaker.startdato && deltaker.startdato !== EMDASH) {
    dato = formatDateFromString(deltaker.startdato)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className={'bg-white w-full mb-8'}>
      {showSuccessMessage && (
        <Alert variant="success" size="medium" className="mb-8">
          <BodyShort role="alert">
            Du er nå meldt på {tiltakOgStedTekst} og vedtaket er fattet.
          </BodyShort>
        </Alert>
      )}

      <Heading level="1" size="large" data-testid="heading_tiltak">
        {tiltakOgStedTekst}
      </Heading>

      <HStack gap="2" className="mt-8" aria-atomic>
        <Label>Status:</Label>
        <DeltakerStatusTag statusType={deltaker.status.type} />
      </HStack>
      {deltaker.status.aarsak && (
        <HStack gap="2" className="mt-4" aria-atomic>
          <Label>Årsak:</Label>
          <BodyShort as="span" className="whitespace-pre-wrap">
            {getDeltakerStatusAarsakText(deltaker.status.aarsak)}
          </BodyShort>
        </HStack>
      )}
      {skalViseDato && (
        <HStack gap="2" className="mt-4">
          <Label>
            {deltaker.startdato && !deltaker.sluttdato
              ? 'Oppstartsdato:'
              : 'Dato:'}
          </Label>
          <BodyShort>{dato}</BodyShort>
        </HStack>
      )}
      {skalViseDeltakerStatusInfoTekst(deltaker.status.type) && (
        <DeltakerStatusInfoTekst
          tiltakstype={deltaker.deltakerliste.tiltakstype}
          statusType={deltaker.status.type}
          arrangorNavn={deltaker.deltakerliste.arrangorNavn}
          oppstartsdato={deltaker.startdato}
        />
      )}

      <AktiveForslag forslag={deltaker.forslag} />

      <DeltakelseInnhold
        tiltakstype={deltaker.deltakerliste.tiltakstype}
        deltakelsesinnhold={deltaker.deltakelsesinnhold}
        heading={
          <Heading level="2" size="medium" className="mt-8 mb-2">
            Dette er innholdet
          </Heading>
        }
        listClassName="mt-2"
      />

      <div>
        {bakgrunnsinformasjon !== EMDASH && (
          <>
            <Heading level="2" size="medium" className="mt-8">
              Bakgrunnsinfo
            </Heading>
            <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
              {bakgrunnsinformasjon}
            </BodyLong>
          </>
        )}

        {visDeltakelsesmengde(deltaker.deltakerliste.tiltakstype) && (
          <>
            <Heading level="2" size="medium" className="mt-8">
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

        <SeEndringer
          className="mt-8"
          tiltakstype={deltaker.deltakerliste.tiltakstype}
          deltakerId={deltaker.deltakerId}
          fetchHistorikk={getHistorikk}
          open={visEndringer}
          onModalClose={() => {
            setSearchParams()
          }}
        />

        <LinkPanel href={DIALOG_URL} className="mt-8 rounded-lg">
          <div className="grid grid-flow-col items-center gap-4">
            <ChatElipsisIcon className="text-2xl" aria-hidden />
            <span>
              Send en melding her til Nav-veilederen din hvis noe skal endres.
            </span>
          </div>
        </LinkPanel>

        <VedtakInfo
          tiltakstype={deltaker.deltakerliste.tiltakstype}
          vedtaksinformasjon={deltaker.vedtaksinformasjon}
          importertFraArena={deltaker.importertFraArena}
          className="mt-8"
        />

        <Heading level="2" size="medium" className="mt-8">
          Du har rett til å klage
        </Heading>
        <BodyLong size="small" className="mt-2">
          Du kan klage hvis du ikke ønsker å delta, er uenig i endringer på
          deltakelsen eller du ønsker et annet arbeidsmarkedstiltak. Fristen for
          å klage er seks uker etter du mottok informasjonen.{' '}
          {
            <Link href="https://www.nav.no/klage">
              Les mer om retten til å klage her.
            </Link>
          }
        </BodyLong>

        <HvaDelesMedArrangor
          arrangorNavn={deltaker.deltakerliste.arrangorNavn}
          adresseDelesMedArrangor={deltaker.adresseDelesMedArrangor}
          className="mt-8"
        />
      </div>
    </div>
  )
}
