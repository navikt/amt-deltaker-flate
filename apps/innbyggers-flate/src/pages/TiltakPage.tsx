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
  EMDASH,
  HvaDelesMedArrangor,
  OmKurset,
  Oppstartstype,
  SeEndringer,
  VedtakOgKlage,
  formatDateFromString,
  getDeltakerStatusAarsakText,
  hentTiltakNavnHosArrangorTekst,
  kanDeleDeltakerMedArrangor,
  skalViseDeltakerStatusInfoTekst,
  visDeltakelsesmengde
} from 'deltaker-flate-common'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DialogLenke } from '../../../../packages/deltaker-flate-common/components/DialogLenke.tsx'
import { useDeltakerContext } from '../DeltakerContext.tsx'
import { getHistorikk } from '../api/api.ts'
import { AktiveForslag } from '../components/AktiveForslag.tsx'
import { DIALOG_URL } from '../utils/environment-utils.ts'

export const TiltakPage = () => {
  const { deltaker, showSuccessMessage } = useDeltakerContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const visEndringer = searchParams.get('vis_endringer') === ''

  const erFellesOppstart =
    deltaker.deltakerliste.oppstartstype === Oppstartstype.FELLES
  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    deltaker.deltakerliste.tiltakstype,
    deltaker.deltakerliste.arrangorNavn
  )
  const skalViseDato =
    deltaker.status.type !== DeltakerStatusType.IKKE_AKTUELL &&
    deltaker.status.type !== DeltakerStatusType.AVBRUTT_UTKAST &&
    deltaker.status.type !== DeltakerStatusType.SOKT_INN &&
    deltaker.status.type !== DeltakerStatusType.VENTELISTE

  const visDeltMedArrangor =
    deltaker.erManueltDeltMedArrangor &&
    kanDeleDeltakerMedArrangor(
      deltaker.deltakerliste.tiltakstype,
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
            {erFellesOppstart
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

      {visDeltMedArrangor && (
        <Alert variant="info" size="small" className="mt-4">
          Informasjon er delt med arrangør for vurdering.
        </Alert>
      )}

      {skalViseDeltakerStatusInfoTekst(deltaker.status.type) && (
        <DeltakerStatusInfoTekst
          tiltakstype={deltaker.deltakerliste.tiltakstype}
          statusType={deltaker.status.type}
          arrangorNavn={deltaker.deltakerliste.arrangorNavn}
          oppstartsdato={deltaker.startdato}
          oppstartstype={deltaker.deltakerliste.oppstartstype}
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

      <OmKurset
        tiltakstype={deltaker.deltakerliste.tiltakstype}
        statusType={deltaker.status.type}
        oppstartstype={deltaker.deltakerliste.oppstartstype}
        startdato={deltaker.deltakerliste.startdato}
        sluttdato={deltaker.deltakerliste.sluttdato}
        className="mt-8"
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
          tiltakstype={deltaker.deltakerliste.tiltakstype}
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
          tiltakstype={deltaker.deltakerliste.tiltakstype}
          oppstartstype={deltaker.deltakerliste.oppstartstype}
          vedtaksinformasjon={deltaker.vedtaksinformasjon}
          importertFraArena={deltaker.importertFraArena}
        />

        <HvaDelesMedArrangor
          arrangorNavn={deltaker.deltakerliste.arrangorNavn}
          adresseDelesMedArrangor={deltaker.adresseDelesMedArrangor}
          tiltaksType={deltaker.deltakerliste.tiltakstype}
          statusType={deltaker.status.type}
          oppstartstype={deltaker.deltakerliste.oppstartstype}
          className="mt-8"
        />
      </div>
    </div>
  )
}
