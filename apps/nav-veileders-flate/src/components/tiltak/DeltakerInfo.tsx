import { ChatElipsisIcon } from '@navikt/aksel-icons'
import {
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
import { getHistorikk } from '../../api/api.ts'
import { DIALOG_URL, KLAGE_URL } from '../../utils/environment-utils.ts'
import { usePameldingContext } from './PameldingContext.tsx'
import { AktiveForslag } from './forslag/AktiveForslag.tsx'

interface Props {
  className: string
}

const skalViseDeltakerStatusInfoTekst = (status: DeltakerStatusType) => {
  return (
    status === DeltakerStatusType.VENTER_PA_OPPSTART ||
    status === DeltakerStatusType.DELTAR ||
    status === DeltakerStatusType.HAR_SLUTTET ||
    status === DeltakerStatusType.IKKE_AKTUELL
  )
}

export const DeltakerInfo = ({ className }: Props) => {
  const { pamelding } = usePameldingContext()
  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    pamelding.deltakerliste.tiltakstype,
    pamelding.deltakerliste.arrangorNavn
  )
  const skalViseDato =
    pamelding.status.type !== DeltakerStatusType.IKKE_AKTUELL &&
    pamelding.status.type !== DeltakerStatusType.AVBRUTT_UTKAST
  const bakgrunnsinformasjon =
    pamelding.bakgrunnsinformasjon && pamelding.bakgrunnsinformasjon.length > 0
      ? pamelding.bakgrunnsinformasjon
      : EMDASH

  let dato = EMDASH
  if (
    pamelding.startdato &&
    pamelding.sluttdato &&
    pamelding.startdato !== EMDASH &&
    pamelding.sluttdato !== EMDASH
  ) {
    dato = `${formatDateFromString(pamelding.startdato)} - ${formatDateFromString(pamelding.sluttdato)}`
  } else if (pamelding.startdato && pamelding.startdato !== EMDASH) {
    dato = formatDateFromString(pamelding.startdato)
  }

  return (
    <div className={`bg-white px-4 py-4 md:px-12 ${className}`}>
      <Heading level="1" size="large">
        {tiltakOgStedTekst}
      </Heading>

      <HStack gap="2" className="mt-8" aria-atomic>
        <Label>Status:</Label>
        <DeltakerStatusTag statusType={pamelding.status.type} />
      </HStack>
      {pamelding.status.aarsak && (
        <HStack gap="2" className="mt-4" aria-atomic>
          <Label>Årsak:</Label>
          <BodyShort as="span" className="whitespace-pre-wrap">
            {getDeltakerStatusAarsakText(pamelding.status.aarsak)}
          </BodyShort>
        </HStack>
      )}
      {skalViseDato && (
        <HStack gap="2" className="mt-4">
          <Label>
            {pamelding.startdato && !pamelding.sluttdato
              ? 'Oppstartsdato:'
              : 'Dato:'}
          </Label>
          <BodyShort>{dato}</BodyShort>
        </HStack>
      )}
      {skalViseDeltakerStatusInfoTekst(pamelding.status.type) && (
        <DeltakerStatusInfoTekst
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          statusType={pamelding.status.type}
          arrangorNavn={pamelding.deltakerliste.arrangorNavn}
          oppstartsdato={pamelding.startdato}
        />
      )}
      <AktiveForslag forslag={pamelding.forslag} />

      <DeltakelseInnhold
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        deltakelsesinnhold={pamelding.deltakelsesinnhold}
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
        {visDeltakelsesmengde(pamelding.deltakerliste.tiltakstype) && (
          <>
            <Heading level="2" size="medium" className="mt-8">
              Deltakelsesmengde
            </Heading>
            <BodyLong size="small" className="mt-2">
              {deltakerprosentText(
                pamelding.deltakelsesprosent,
                pamelding.dagerPerUke
              )}
            </BodyLong>
          </>
        )}

        <SeEndringer
          className="mt-8"
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          deltakerId={pamelding.deltakerId}
          fetchHistorikk={getHistorikk}
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
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          vedtaksinformasjon={pamelding.vedtaksinformasjon}
          importertFraArena={pamelding.importertFraArena}
          className="mt-8"
        />

        <Heading level="2" size="medium" className="mt-8">
          Du har rett til å klage
        </Heading>
        <BodyLong size="small" className="mt-2">
          Du kan klage hvis du ikke ønsker å delta, er uenig i endringer på
          deltakelsen eller du ønsker et annet arbeidsmarkedstiltak. Fristen for
          å klage er seks uker etter du mottok informasjonen. Les mer om{' '}
          {<Link href={KLAGE_URL}>retten til å klage her.</Link>}
        </BodyLong>

        <HvaDelesMedArrangor
          arrangorNavn={pamelding.deltakerliste.arrangorNavn}
          adresseDelesMedArrangor={pamelding.adresseDelesMedArrangor}
          tiltaksType={pamelding.deltakerliste.tiltakstype}
          className="mt-8"
        />
      </div>
    </div>
  )
}
