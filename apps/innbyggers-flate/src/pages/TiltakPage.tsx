import { useDeltakerContext } from '../DeltakerContext.tsx'
import {
  BodyLong,
  BodyShort,
  ExpansionCard,
  Heading,
  HStack,
  Label,
  Link,
  LinkPanel,
  List
} from '@navikt/ds-react'
import {
  EMDASH,
  formatDateFromString,
  getDeltakerStatusAarsakText,
  hentTiltakNavnHosArrangørTekst,
  INNHOLD_TYPE_ANNET
} from '../utils/utils.ts'
import {
  DeltakerResponse,
  DeltakerStatusType,
  Tiltakstype
} from '../api/data/deltaker.ts'
import { ChatElipsisIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { getDialogUrl } from '../utils/environment-utils.ts'
import { DeltakerStatusTag } from '../components/DeltakerStatusTag.tsx'
import { HvaErDette } from '../components/HvaErDette.tsx'
import { DeltakerStatusInfoTekst } from '../components/DeltakerStatusInfoTekst.tsx'

const skalViseDeltakelsesmengde = (deltaker: DeltakerResponse) => {
  return (
    deltaker.deltakerliste.tiltakstype == Tiltakstype.ARBFORB ||
    deltaker.deltakerliste.tiltakstype == Tiltakstype.VASV
  )
}

const deltakelsesmengdeString = (deltaker: DeltakerResponse): string => {
  if (deltaker.dagerPerUke !== null) {
    if (deltaker.dagerPerUke === 1) {
      return `${deltaker.deltakelsesprosent ?? 100}\u00A0% ${deltaker.dagerPerUke} dag i uka`
    } else {
      return `${deltaker.deltakelsesprosent ?? 100}\u00A0% ${deltaker.dagerPerUke} dager i uka`
    }
  }

  return `${deltaker.deltakelsesprosent}\u00A0%`
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
  const { deltaker } = useDeltakerContext()

  const tiltakOgStedTekst = hentTiltakNavnHosArrangørTekst(
    deltaker.deltakerliste.tiltakstype,
    deltaker.deltakerliste.arrangorNavn
  )
  const skalViseDato =
    deltaker.status.type !== DeltakerStatusType.IKKE_AKTUELL &&
    deltaker.status.type !== DeltakerStatusType.AVBRUTT_UTKAST
  const bakgrunsinformasjon =
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

  return (
    <div className={'bg-white py-4 w-full'}>
      <Heading level="1" size="large">
        {tiltakOgStedTekst}
      </Heading>

      <HStack gap="2" className="mt-8">
        <Label>Status:</Label>
        <DeltakerStatusTag statusType={deltaker.status.type} />
      </HStack>
      {deltaker.status.aarsak && (
        <HStack gap="2" className="mt-4">
          <Label>Årsak:</Label>
          <BodyShort>
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

      <Heading level="2" size="medium" className="mt-8">
        Hva er innholdet?
      </Heading>
      <BodyLong className="mt-4" size="small">
        {deltaker.deltakelsesinnhold?.ledetekst ?? ''}
      </BodyLong>
      {deltaker.deltakelsesinnhold && (
        <List as="ul" size="small" className="mt-4">
          {deltaker.deltakelsesinnhold.innhold
            .filter((i) => i.valgt)
            .map((i) => (
              <List.Item key={i.innholdskode}>
                {i.innholdskode === INNHOLD_TYPE_ANNET
                  ? i.beskrivelse
                  : i.tekst}
              </List.Item>
            ))}
        </List>
      )}
      <div>
        <Heading level="2" size="medium" className="mt-8">
          Bakgrunnsinfo
        </Heading>
        <BodyLong size="small" className="mt-2">
          {bakgrunsinformasjon}
        </BodyLong>

        {skalViseDeltakelsesmengde(deltaker) && (
          <>
            <Heading level="2" size="medium" className="mt-8">
              Deltakelsesmengde
            </Heading>
            <BodyLong size="small" className="mt-2">
              {deltakelsesmengdeString(deltaker)}
            </BodyLong>
          </>
        )}

        <Link href="#" className="mt-8">
          {/* TODO: lenke til riktig sted */}
          Se endringer
          <span>
            <ChevronRightIcon
              title="Gå til side for endringer"
              className="text-2xl"
            />
          </span>
        </Link>

        <LinkPanel href={getDialogUrl()} className="mt-8 rounded-lg">
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
          {
            <Link href="#">
              {/* TODO: lenke til klageinfoside */}
              retten til å klage her.
            </Link>
          }
        </BodyLong>

        <ExpansionCard aria-label="Demo med bare tittel" className="mt-8">
          <ExpansionCard.Header>
            <ExpansionCard.Title>Hva deles med arrangøren?</ExpansionCard.Title>
          </ExpansionCard.Header>
          <ExpansionCard.Content>
            <BodyLong size="small">
              NAV samarbeider med {deltaker.deltakerliste.arrangorNavn}.
              Arrangøren behandler opplysninger på vegne av NAV.
            </BodyLong>
            <List as="ul" size="small">
              <List.Item>
                Navn og kontaktinformasjonen til NAV-veilederen din
              </List.Item>
              <List.Item>
                Påmeldingen: Innholdet og bakgrunnsinformasjon
              </List.Item>
              <List.Item>Navn og fødselsnummer</List.Item>
              <List.Item>Telefonnummer og e-postadresse</List.Item>
              {deltaker.adresseDelesMedArrangor && (
                <List.Item>Adresse</List.Item>
              )}
            </List>
            <Link
              href="http://nav.no/person/personopplysninger/"
              className="text-base"
            >
              Se her hvilke opplysninger NAV har om deg.
            </Link>
          </ExpansionCard.Content>
        </ExpansionCard>
      </div>
    </div>
  )
}
