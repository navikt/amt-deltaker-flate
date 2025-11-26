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
  Oppmotested,
  SeEndringer,
  VedtakOgKlage,
  formatDateFromString,
  getDeltakerStatusAarsakText,
  harFellesOppstart,
  hentTiltakNavnHosArrangorTekst,
  kanDeleDeltakerMedArrangor,
  skalViseDeltakerStatusInfoTekst,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDeltakerContext } from '../DeltakerContext.tsx'
import { getHistorikk } from '../api/api.ts'
import { AktiveForslag } from '../components/AktiveForslag.tsx'
import { DIALOG_URL } from '../utils/environment-utils.ts'

export const TiltakPage = () => {
  const { deltaker, showSuccessMessage } = useDeltakerContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const visEndringer = searchParams.get('vis_endringer') === ''

  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    deltaker.deltakerliste.tiltakskode,
    deltaker.deltakerliste.arrangorNavn
  )
  const skalViseDato =
    deltaker.startdato &&
    deltaker.startdato !== EMDASH &&
    deltaker.status.type !== DeltakerStatusType.IKKE_AKTUELL &&
    deltaker.status.type !== DeltakerStatusType.AVBRUTT_UTKAST &&
    deltaker.status.type !== DeltakerStatusType.VENTELISTE

  const visDeltMedArrangor =
    deltaker.erManueltDeltMedArrangor &&
    kanDeleDeltakerMedArrangor(
      deltaker.deltakerliste.tiltakskode,
      deltaker.deltakerliste.oppstartstype
    ) &&
    (deltaker.status.type === DeltakerStatusType.SOKT_INN ||
      deltaker.status.type === DeltakerStatusType.VURDERES)

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
            {harFellesOppstart(deltaker.deltakerliste.oppstartstype) ||
            deltaker.deltakerliste.erEnkeltplassUtenRammeavtale
              ? `Du er nå søkt inn på ${tiltakOgStedTekst}.`
              : `Du er nå meldt på ${tiltakOgStedTekst} og vedtaket er fattet.`}
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

      {skalViseDeltakerStatusInfoTekst(deltaker.status.type) && (
        <DeltakerStatusInfoTekst
          tiltakskode={deltaker.deltakerliste.tiltakskode}
          deltakerlisteNavn={deltaker.deltakerliste.deltakerlisteNavn}
          tiltaketsStartDato={deltaker.deltakerliste.startdato}
          statusType={deltaker.status.type}
          arrangorNavn={deltaker.deltakerliste.arrangorNavn}
          oppstartsdato={deltaker.startdato}
          oppstartstype={deltaker.deltakerliste.oppstartstype}
          erEnkeltplassUtenRammeavtale={
            deltaker.deltakerliste.erEnkeltplassUtenRammeavtale
          }
        />
      )}

      {visDeltMedArrangor && (
        <Alert variant="info" size="small" className="mt-4">
          Informasjon er delt med arrangør for vurdering.
        </Alert>
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

      <OmKurset
        tiltakskode={deltaker.deltakerliste.tiltakskode}
        statusType={deltaker.status.type}
        oppstartstype={deltaker.deltakerliste.oppstartstype}
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
          open={visEndringer}
          onModalClose={() => {
            setSearchParams()
          }}
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
          erEnkeltplassUtenRammeavtale={
            deltaker.deltakerliste.erEnkeltplassUtenRammeavtale
          }
          className="mt-8"
        />
      </div>
    </div>
  )
}
