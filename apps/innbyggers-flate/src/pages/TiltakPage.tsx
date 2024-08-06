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
  DeltakelseInnholdListe,
  DeltakerStatusInfoTekst,
  DeltakerStatusTag,
  DeltakerStatusType,
  EMDASH,
  HvaDelesMedArrangor,
  SeEndringer,
  Tiltakstype,
  deltakerprosentText,
  formatDateFromString,
  getDeltakerStatusAarsakText,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import { useEffect } from 'react'
import { useDeltakerContext } from '../DeltakerContext.tsx'
import { getHistorikk } from '../api/api.ts'
import { DeltakerResponse } from '../api/data/deltaker.ts'
import { AktiveForslag } from '../components/AktiveForslag.tsx'
import { HvaErDette } from '../components/HvaErDette.tsx'
import { DIALOG_URL } from '../utils/environment-utils.ts'
const skalViseDeltakelsesmengde = (deltaker: DeltakerResponse) => {
  return (
    deltaker.deltakerliste.tiltakstype == Tiltakstype.ARBFORB ||
    deltaker.deltakerliste.tiltakstype == Tiltakstype.VASV
  )
}

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
          Du er nå meldt på {tiltakOgStedTekst} og vedtaket er fattet.
        </Alert>
      )}

      <Heading level="1" size="large" data-testid="heading_tiltak">
        {tiltakOgStedTekst}
      </Heading>

      <HStack gap="2" className="mt-8">
        <Label>Status:</Label>
        <DeltakerStatusTag statusType={deltaker.status.type} />
      </HStack>
      {deltaker.status.aarsak && (
        <HStack gap="2" className="mt-4">
          <Label>Årsak:</Label>
          <BodyShort className="whitespace-pre-wrap">
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
          statusType={deltaker.status.type}
          tiltakOgStedTekst={tiltakOgStedTekst}
          oppstartsdato={deltaker.startdato}
        />
      )}

      <AktiveForslag forslag={deltaker.forslag} />

      <Heading level="2" size="medium" className="mt-8">
        Dette er innholdet
      </Heading>
      <BodyLong className="mt-4" size="small">
        {deltaker.deltakelsesinnhold?.ledetekst ?? ''}
      </BodyLong>
      {deltaker.deltakelsesinnhold && (
        <DeltakelseInnholdListe
          deltakelsesinnhold={deltaker.deltakelsesinnhold}
          className="mt-4"
        />
      )}
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

        {skalViseDeltakelsesmengde(deltaker) && (
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
          deltakerId={deltaker.deltakerId}
          fetchHistorikk={getHistorikk}
        />

        <LinkPanel href={DIALOG_URL} className="mt-8 rounded-lg">
          <div className="grid grid-flow-col items-center gap-4">
            <ChatElipsisIcon className="text-2xl" />
            <span>
              Send en melding her til NAV-veilederen din hvis noe skal endres.
            </span>
          </div>
        </LinkPanel>

        <HvaErDette
          tiltakstype={deltaker.deltakerliste.tiltakstype}
          vedtaksinformasjon={deltaker.vedtaksinformasjon}
          className="mt-8"
        />

        <Heading level="2" size="medium" className="mt-8">
          Du har rett til å klage
        </Heading>
        <BodyLong size="small" className="mt-1">
          Du kan klage hvis du ikke ønsker å delta, er uenig i endringer på
          deltakelsen eller du ønsker et annet arbeidsmarkedstiltak. Fristen for
          å klage er seks uker etter du mottok informasjonen. Les mer om{' '}
          {<Link href="https://www.nav.no/klage">retten til å klage her.</Link>}
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
