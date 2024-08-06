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
import { getHistorikk } from '../../api/api.ts'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import { DIALOG_URL, KLAGE_URL } from '../../utils/environment-utils.ts'
import { HvaErDette } from './HvaErDette.tsx'
import { usePameldingContext } from './PameldingContext.tsx'
import { AktiveForslag } from './forslag/AktiveForslag.tsx'

interface Props {
  className: string
}

const skalViseDeltakelsesmengde = (pamelding: PameldingResponse) => {
  return (
    pamelding.deltakerliste.tiltakstype == Tiltakstype.ARBFORB ||
    pamelding.deltakerliste.tiltakstype == Tiltakstype.VASV
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

      <HStack gap="2" className="mt-8">
        <Label>Status:</Label>
        <DeltakerStatusTag statusType={pamelding.status.type} />
      </HStack>
      {pamelding.status.aarsak && (
        <HStack gap="2" className="mt-4">
          <Label>Årsak:</Label>
          <BodyShort className="whitespace-pre-wrap">
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
          statusType={pamelding.status.type}
          tiltakOgStedTekst={tiltakOgStedTekst}
          oppstartsdato={pamelding.startdato}
        />
      )}
      <AktiveForslag forslag={pamelding.forslag} />
      <Heading level="2" size="medium" className="mt-8">
        Dette er innholdet
      </Heading>
      <BodyLong className="mt-4" size="small">
        {pamelding.deltakelsesinnhold?.ledetekst ?? ''}
      </BodyLong>
      {pamelding.deltakelsesinnhold && (
        <DeltakelseInnholdListe
          deltakelsesinnhold={pamelding.deltakelsesinnhold}
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
        {skalViseDeltakelsesmengde(pamelding) && (
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
          deltakerId={pamelding.deltakerId}
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
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          vedtaksinformasjon={pamelding.vedtaksinformasjon}
          className="mt-8"
        />

        <Heading level="2" size="medium" className="mt-8">
          Du har rett til å klage
        </Heading>
        <BodyLong size="small" className="mt-1">
          Du kan klage hvis du ikke ønsker å delta, er uenig i endringer på
          deltakelsen eller du ønsker et annet arbeidsmarkedstiltak. Fristen for
          å klage er seks uker etter du mottok informasjonen. Les mer om{' '}
          {<Link href={KLAGE_URL}>retten til å klage her.</Link>}
        </BodyLong>

        <HvaDelesMedArrangor
          arrangorNavn={pamelding.deltakerliste.arrangorNavn}
          adresseDelesMedArrangor={pamelding.adresseDelesMedArrangor}
          className="mt-8"
        />
      </div>
    </div>
  )
}
