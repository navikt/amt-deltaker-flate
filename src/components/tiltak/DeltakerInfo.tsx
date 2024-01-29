import { BodyLong, Detail, HStack, Heading, Link, List, Tag } from '@navikt/ds-react'
import { getDeltakerStatusDisplayText, getTiltakstypeDisplayText } from '../../utils/displayText.ts'
import { Todo } from '../Todo.tsx'
import { ChevronRightIcon } from '@navikt/aksel-icons'
import { MAL_TYPE_ANNET } from '../../utils.ts'
import { DeltakerLenker } from './DeltakerLenker.tsx'
import { usePameldingCOntext } from './PameldingContext.tsx'

export const DeltakerInfo = () => {
  const { pamelding } = usePameldingCOntext()
  const tiltaOgSted = `${getTiltakstypeDisplayText(pamelding.deltakerliste.tiltakstype)} hos ${
    pamelding.deltakerliste.arrangorNavn
  }`

  return (
    <div className="space-y-4 bg-white px-12 py-4">
      <Heading level="1" size="large">
        {tiltaOgSted}
      </Heading>
      <HStack gap="2">
        <Detail weight="semibold">Status:</Detail>
        <Tag variant="info" size="small">
          {getDeltakerStatusDisplayText(pamelding.status.type)}
        </Tag>
      </HStack>
      <HStack gap="2">
        <Detail weight="semibold">Dato:</Detail>
        <Detail>{pamelding.startdato || '—'}</Detail>
      </HStack>
      <BodyLong size="small">{`Du er meldt på arbeidsmarkedstiltaket: ${tiltaOgSted}. Når arrangøren har en ledig plass så vil de ta kontakt med deg for å avklare oppstart.`}</BodyLong>
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
        {pamelding.mal
          .filter((mal) => mal.valgt)
          .map((mal) => (
            <List.Item key={mal.type}>
              {mal.type === MAL_TYPE_ANNET ? mal.beskrivelse : mal.visningstekst}
            </List.Item>
          ))}
      </List>
      <Heading level="2" size="medium">
        Bakgrunnsinformasjon
      </Heading>
      <BodyLong size="small">{pamelding.bakgrunnsinformasjon}</BodyLong>
      <Link href="#">
        <Todo /> Se endringer
        <ChevronRightIcon title="Gå til side for endringer" />
      </Link>{' '}
      <Heading level="2" size="medium">
        Hva er dette?
      </Heading>
      <DeltakerLenker />
    </div>
  )
}
