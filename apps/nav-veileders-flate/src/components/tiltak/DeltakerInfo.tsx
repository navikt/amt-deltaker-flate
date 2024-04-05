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
  getDeltakerStatusAarsakText,
  hentTiltakNavnHosArrangorTekst
} from '../../utils/displayText.ts'
import { ChatElipsisIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { usePameldingContext } from './PameldingContext.tsx'
import { DeltakerIStatusTag } from '../DeltakerIStatusTag.tsx'
import {
  EMDASH,
  formatDateFromString,
  INNHOLD_TYPE_ANNET
} from '../../utils/utils.ts'
import {
  DeltakerStatusType,
  PameldingResponse,
  Tiltakstype
} from '../../api/data/pamelding.ts'
import { HvaErDette } from './HvaErDette.tsx'

interface Props {
  className: string
}

const skalViseDeltakelsesmengde = (pamelding: PameldingResponse) => {
  return (
    pamelding.deltakerliste.tiltakstype == Tiltakstype.ARBFORB ||
    pamelding.deltakerliste.tiltakstype == Tiltakstype.VASV
  )
}

const deltakelsesMengdeString = (pamelding: PameldingResponse): string => {
  if (pamelding.dagerPerUke !== null) {
    if (pamelding.dagerPerUke === 1) {
      return `${pamelding.deltakelsesprosent ?? 100}\u00A0% ${pamelding.dagerPerUke} dag i uka`
    } else {
      return `${pamelding.deltakelsesprosent ?? 100}\u00A0% ${pamelding.dagerPerUke} dager i uka`
    }
  }

  return `${pamelding.deltakelsesprosent}\u00A0%`
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
  const bakgrunsinformasjon =
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
    <div className={`bg-white px-12 py-4 ${className}`}>
      <Heading level="1" size="large">
        {tiltakOgStedTekst}
      </Heading>

      <HStack gap="2" className="mt-8">
        <Label>Status:</Label>
        <DeltakerIStatusTag statusType={pamelding.status.type} />
      </HStack>
      {pamelding.status.aarsak && (
        <HStack gap="2" className="mt-4">
          <Label>Årsak:</Label>
          <BodyShort>
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
      <BodyLong size="small" className="mt-4">
        {`Du er meldt på arbeidsmarkedstiltaket: ${tiltakOgStedTekst}. Når arrangøren har en ledig plass så vil de ta kontakt med deg for å avklare oppstart.`}
      </BodyLong>

      <Heading level="2" size="medium" className="mt-8">
        Hva er innholdet?
      </Heading>
      <BodyLong className="mt-4" size="small">
        {pamelding.deltakelsesinnhold?.ledetekst ?? ''}
      </BodyLong>
      {pamelding.deltakelsesinnhold && (
        <List as="ul" size="small" className="mt-4">
          {pamelding.deltakelsesinnhold.innhold
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

        {skalViseDeltakelsesmengde(pamelding) && (
          <>
            <Heading level="2" size="medium" className="mt-8">
              Deltakelsesmengde
            </Heading>
            <BodyLong size="small" className="mt-2">
              {deltakelsesMengdeString(pamelding)}
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

        <LinkPanel href="#" className="mt-8 rounded-lg">
          {/* TODO: lenke til dialogen */}
          <div className="grid grid-flow-col items-center gap-4">
            <ChatElipsisIcon className="text-2xl" />
            <span>
              Send en melding her til NAV-veilederen din hvis noe skal endres.
            </span>
          </div>
        </LinkPanel>

        <HvaErDette
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
              NAV samarbeider med {pamelding.deltakerliste.arrangorNavn}.
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
              {pamelding.adresseDelesMedArrangor && (
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
