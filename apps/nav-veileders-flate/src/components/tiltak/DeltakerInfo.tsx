import { Alert, BodyLong, BodyShort, Heading, Label } from '@navikt/ds-react'
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
  Oppmotested,
  SeEndringer,
  VedtakOgKlage,
  formatDate,
  getDeltakerStatusAarsakText,
  hentTiltakNavnHosArrangorTekst,
  kanDeleDeltakerMedArrangorForVurdering,
  skalViseDeltakerStatusInfoTekst,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { getHistorikk } from '../../api/api.ts'
import { DIALOG_URL } from '../../utils/environment-utils.ts'
import { useDeltakerContext } from './DeltakerContext.tsx'
import { AktiveForslag } from './forslag/AktiveForslag.tsx'

interface Props {
  className: string
}

export const DeltakerInfo = ({ className }: Props) => {
  const { deltaker } = useDeltakerContext()
  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    deltaker.deltakerliste.tiltakskode,
    deltaker.deltakerliste.arrangorNavn
  )

  const skalViseDato =
    deltaker.startdato &&
    deltaker.status.type !== DeltakerStatusType.IKKE_AKTUELL &&
    deltaker.status.type !== DeltakerStatusType.AVBRUTT_UTKAST &&
    deltaker.status.type !== DeltakerStatusType.VENTELISTE

  const bakgrunnsinformasjon =
    deltaker.bakgrunnsinformasjon && deltaker.bakgrunnsinformasjon.length > 0
      ? deltaker.bakgrunnsinformasjon
      : EMDASH

  let dato = EMDASH
  if (deltaker.startdato && deltaker.sluttdato) {
    dato = `${formatDate(deltaker.startdato)} - ${formatDate(deltaker.sluttdato)}`
  } else if (deltaker.startdato) {
    dato = formatDate(deltaker.startdato)
  }

  const visDeltMedArrangor =
    deltaker.erManueltDeltMedArrangor &&
    kanDeleDeltakerMedArrangorForVurdering(
      deltaker.deltakerliste.pameldingstype,
      deltaker.deltakerliste.tiltakskode,
      deltaker.deltakerliste.erEnkeltplass
    ) &&
    (deltaker.status.type === DeltakerStatusType.SOKT_INN ||
      deltaker.status.type === DeltakerStatusType.VURDERES)

  return (
    <div
      className={`bg-(--ax-bg-default) px-12 py-4 max-ax-md:px-4 ${className}`}
    >
      <Heading level="1" size="large">
        {tiltakOgStedTekst}
      </Heading>

      <div className="flex gap-2 mt-8" aria-atomic>
        <Label>Status:</Label>
        <DeltakerStatusTag statusType={deltaker.status.type} />
      </div>
      {deltaker.status.aarsak && (
        <div className="flex gap-2 mt-4" aria-atomic>
          <Label>Årsak:</Label>
          <BodyShort as="span" size="small" className="whitespace-pre-wrap">
            {getDeltakerStatusAarsakText(deltaker.status.aarsak)}
          </BodyShort>
        </div>
      )}

      {skalViseDeltakerStatusInfoTekst(deltaker.status.type) && (
        <DeltakerStatusInfoTekst
          tiltakskode={deltaker.deltakerliste.tiltakskode}
          deltakerlisteNavn={deltaker.deltakerliste.deltakerlisteNavn}
          tiltaketsStartDato={deltaker.deltakerliste.startdato}
          statusType={deltaker.status.type}
          arrangorNavn={deltaker.deltakerliste.arrangorNavn}
          oppstartsdato={deltaker.startdato}
          pameldingstype={deltaker.deltakerliste.pameldingstype}
          oppstartstype={deltaker.deltakerliste.oppstartstype}
          erEnkeltplass={deltaker.deltakerliste.erEnkeltplass}
        />
      )}

      {skalViseDato && (
        <div className="flex gap-2 mt-4">
          <Label>
            {deltaker.startdato && !deltaker.sluttdato
              ? 'Oppstartsdato:'
              : 'Dato:'}
          </Label>
          <BodyShort size="small">{dato}</BodyShort>
        </div>
      )}

      {visDeltMedArrangor && (
        <Alert variant="info" size="small" className="mt-4">
          Informasjon er delt med arrangør for vurdering.
        </Alert>
      )}

      <OmKurset
        tiltakskode={deltaker.deltakerliste.tiltakskode}
        statusType={deltaker.status.type}
        oppstartstype={deltaker.deltakerliste.oppstartstype}
        pameldingstype={deltaker.deltakerliste.pameldingstype}
        startdato={deltaker.deltakerliste.startdato}
        sluttdato={deltaker.deltakerliste.sluttdato}
        headingLevel={2}
        className="mt-8"
      />

      <Oppmotested
        oppmoteSted={deltaker.deltakerliste.oppmoteSted}
        statusType={deltaker.status.type}
        className="mt-4"
      />

      <AktiveForslag className="mt-8" forslag={deltaker.forslag} />

      <DeltakelseInnhold
        tiltakskode={deltaker.deltakerliste.tiltakskode}
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
        {visDeltakelsesmengde(deltaker.deltakerliste.tiltakskode) && (
          <DeltakelsesmengdeInfo
            deltakelsesprosent={deltaker.deltakelsesprosent}
            dagerPerUke={deltaker.dagerPerUke}
            nesteDeltakelsesmengde={
              deltaker.deltakelsesmengder.nesteDeltakelsesmengde
            }
          />
        )}

        <SeEndringer
          className="mt-8"
          tiltakskode={deltaker.deltakerliste.tiltakskode}
          deltakerId={deltaker.deltakerId}
          fetchHistorikk={getHistorikk}
        />

        <DialogLenke dialogUrl={DIALOG_URL} className="mt-8" />

        <VedtakOgKlage
          statusType={deltaker.status.type}
          statusDato={deltaker.status.opprettet}
          tiltakskode={deltaker.deltakerliste.tiltakskode}
          oppstartstype={deltaker.deltakerliste.oppstartstype}
          vedtaksinformasjon={deltaker.vedtaksinformasjon}
          importertFraArena={deltaker.importertFraArena}
        />

        <HvaDelesMedArrangor
          arrangorNavn={deltaker.deltakerliste.arrangorNavn}
          adresseDelesMedArrangor={deltaker.adresseDelesMedArrangor}
          tiltakskode={deltaker.deltakerliste.tiltakskode}
          statusType={deltaker.status.type}
          oppstartstype={deltaker.deltakerliste.oppstartstype}
          pameldingstype={deltaker.deltakerliste.pameldingstype}
          className="mt-8"
          erEnkeltplass={deltaker.deltakerliste.erEnkeltplass}
        />
      </div>
    </div>
  )
}
