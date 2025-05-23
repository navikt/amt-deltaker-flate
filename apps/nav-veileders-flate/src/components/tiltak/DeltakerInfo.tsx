import {
  Alert,
  BodyLong,
  BodyShort,
  HStack,
  Heading,
  Label
} from '@navikt/ds-react'
import {
  DeltakelseInnhold,
  DeltakelsesmengdeInfo,
  DeltakerStatusInfoTekst,
  DeltakerStatusTag,
  DeltakerStatusType,
  DialogLenke,
  EMDASH,
  HvaDelesMedArrangor,
  OmKurset,
  SeEndringer,
  VedtakOgKlage,
  formatDateFromString,
  getDeltakerStatusAarsakText,
  hentTiltakNavnHosArrangorTekst,
  kanDeleDeltakerMedArrangor,
  skalViseDeltakerStatusInfoTekst,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { getHistorikk } from '../../api/api.ts'
import { DIALOG_URL } from '../../utils/environment-utils.ts'
import { usePameldingContext } from './PameldingContext.tsx'
import { AktiveForslag } from './forslag/AktiveForslag.tsx'

interface Props {
  className: string
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

  const visDeltMedArrangor =
    pamelding.erManueltDeltMedArrangor &&
    kanDeleDeltakerMedArrangor(
      pamelding.deltakerliste.tiltakstype,
      pamelding.deltakerliste.oppstartstype
    ) &&
    (pamelding.status.type === DeltakerStatusType.SOKT_INN ||
      pamelding.status.type === DeltakerStatusType.VURDERES)

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
      {visDeltMedArrangor && (
        <Alert variant="info" size="small" className="mt-4">
          Informasjon er delt med arrangør for vurdering.
        </Alert>
      )}

      {skalViseDeltakerStatusInfoTekst(pamelding.status.type) && (
        <DeltakerStatusInfoTekst
          tiltaksType={pamelding.deltakerliste.tiltakstype}
          deltakerlisteNavn={pamelding.deltakerliste.deltakerlisteNavn}
          tiltaketsStartDato={pamelding.deltakerliste.startdato}
          statusType={pamelding.status.type}
          arrangorNavn={pamelding.deltakerliste.arrangorNavn}
          oppstartsdato={pamelding.startdato}
          oppstartstype={pamelding.deltakerliste.oppstartstype}
        />
      )}

      <AktiveForslag forslag={pamelding.forslag} />

      <OmKurset
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
        deltakerlisteNavn={pamelding.deltakerliste.deltakerlisteNavn}
        statusType={pamelding.status.type}
        oppstartstype={pamelding.deltakerliste.oppstartstype}
        startdato={pamelding.deltakerliste.startdato}
        sluttdato={pamelding.deltakerliste.sluttdato}
        className="mt-8"
      />

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
          <DeltakelsesmengdeInfo
            deltakelsesprosent={pamelding.deltakelsesprosent}
            dagerPerUke={pamelding.dagerPerUke}
            nesteDeltakelsesmengde={
              pamelding.deltakelsesmengder.nesteDeltakelsesmengde
            }
          />
        )}

        <SeEndringer
          className="mt-8"
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          deltakerId={pamelding.deltakerId}
          fetchHistorikk={getHistorikk}
        />

        <DialogLenke dialogUrl={DIALOG_URL} className="mt-8" />

        <VedtakOgKlage
          statusType={pamelding.status.type}
          statusDato={pamelding.status.opprettet}
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          oppstartstype={pamelding.deltakerliste.oppstartstype}
          vedtaksinformasjon={pamelding.vedtaksinformasjon}
          importertFraArena={pamelding.importertFraArena}
        />

        <HvaDelesMedArrangor
          arrangorNavn={pamelding.deltakerliste.arrangorNavn}
          adresseDelesMedArrangor={pamelding.adresseDelesMedArrangor}
          tiltaksType={pamelding.deltakerliste.tiltakstype}
          statusType={pamelding.status.type}
          oppstartstype={pamelding.deltakerliste.oppstartstype}
          className="mt-8"
        />
      </div>
    </div>
  )
}
