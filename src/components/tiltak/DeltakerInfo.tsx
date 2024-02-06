import { BodyLong, Detail, HStack, Heading, List, Link } from '@navikt/ds-react'
import { getDeltakerStatusAarsakText, getTiltakstypeDisplayText } from '../../utils/displayText.ts'
import { Todo } from '../Todo.tsx'
import { ChevronRightIcon } from '@navikt/aksel-icons'
import { usePameldingCOntext } from './PameldingContext.tsx'
import { DeltakerIStatusTag } from '../DeltakerIStatusTag.tsx'
import { EMDASH, INNHOLD_TYPE_ANNET, formatDateStrWithMonthName } from '../../utils/utils.ts'
import { DeltakerStatusType } from '../../api/data/pamelding.ts'

export const DeltakerInfo = () => {
  const { pamelding } = usePameldingCOntext()
  const tiltaOgSted = `${getTiltakstypeDisplayText(pamelding.deltakerliste.tiltakstype)} hos ${
    pamelding.deltakerliste.arrangorNavn
  }`
  const skalViseDato =
    pamelding.status.type !== DeltakerStatusType.IKKE_AKTUELL &&
    pamelding.status.type !== DeltakerStatusType.AVBRUTT_UTKAST

  return (
    <div className="space-y-4 bg-white px-12 py-4">
      <Heading level="1" size="large">
        {tiltaOgSted}
      </Heading>
      <HStack gap="2">
        <Detail weight="semibold">Status:</Detail>
        <DeltakerIStatusTag statusType={pamelding.status.type} />
      </HStack>
      {pamelding.status.aarsak && (
        <HStack gap="2">
          <Detail weight="semibold">Årsak:</Detail>
          <Detail>{getDeltakerStatusAarsakText(pamelding.status.aarsak)}</Detail>
        </HStack>
      )}
      {skalViseDato && (
        <HStack gap="2">
          <Detail weight="semibold">Dato:</Detail>
          <Detail>{formatDateStrWithMonthName(pamelding.startdato) || EMDASH}</Detail>
        </HStack>
      )}
      <BodyLong size="small">
        {`Du er meldt på arbeidsmarkedstiltaket: ${tiltaOgSted}. Når arrangøren har en ledig plass så vil de ta kontakt med deg for å avklare oppstart.`}
      </BodyLong>
      <Detail textColor="subtle">
        <Todo />
        {`Meldt på: ${'TODO når meldt på'} av ${'TODO veileders navn'} ${'TODO navkontor'}`}
      </Detail>
      <Heading level="2" size="medium">
        Hva er innholdet?
      </Heading>
      <BodyLong>
        Du får tett oppfølging og støtte av en veileder. Sammen kartlegger dere hvordan din
        kompetanse, interesser og ferdigheter påvirker muligheten din til å jobbe.
      </BodyLong>
      <List as="ul" size="small">
        {pamelding.innhold
          .filter((i) => i.valgt)
          .map((i) => (
            <List.Item key={i.type}>
              {i.type === INNHOLD_TYPE_ANNET ? i.beskrivelse : i.visningstekst}
            </List.Item>
          ))}
      </List>
      <div>
        <Heading level="2" size="medium">
          Bakgrunnsinformasjon
        </Heading>
        <BodyLong size="small">{pamelding.bakgrunnsinformasjon}</BodyLong>
      </div>
      <Link href="#">
        <Todo /> Se endringer
        <span>
          <ChevronRightIcon title="Gå til side for endringer" />
        </span>
      </Link>{' '}
      <div>
        <Heading level="2" size="medium">
          Hva er dette?
        </Heading>
        <BodyLong size="small">
          Dette er et vedtak etter arbeidsmarkedsloven § 12 og forskrift om arbeidsmarkedstiltak
          kapittel 4.
        </BodyLong>
        <Detail
          size="small"
          className="mt-2"
        >{`Meldt på: ${formatDateStrWithMonthName(pamelding.sistEndret)} av ${pamelding.sistEndretAv} ${pamelding.sistEndretAvEnhet}`}</Detail>
      </div>
      <div>
        <Heading level="2" size="medium">
          Du har rett til å klage
        </Heading>
        <BodyLong>
          Du kan klage hvis du ikke ønsker å delta, er uenig i endringer på deltakelsen eller du
          ønsker et annet arbeidsmarkedstiltak. Fristen for å klage er seks uker etter du mottok
          informasjonen. Les mer om
          {
            <Link href="#">
              <Todo />
              retten til å klage her.
            </Link>
          }
        </BodyLong>
      </div>
    </div>
  )
}
