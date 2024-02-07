import { BodyLong, Heading, List, VStack } from '@navikt/ds-react'
import { Innhold } from '../../api/data/pamelding.ts'
import { INNHOLD_TYPE_ANNET } from '../../utils/utils.ts'

interface Props {
  innhold: Innhold[]
  bakgrunnsinformasjon: string | null
}

export const Utkast = ({ innhold, bakgrunnsinformasjon }: Props) => {
  return (
    <VStack gap="4">
      <Heading level="2" size="medium">
        Hva er innholdet?
      </Heading>
      <BodyLong size="small">
        Du får tett oppfølging og støtte av en veileder. Sammen kartlegger dere hvordan din
        kompetanse, interesser og ferdigheter påvirker muligheten din til å jobbe.
      </BodyLong>
      <List as="ul" size="small">
        {innhold
          .filter((i) => i.valgt)
          .map((i) => (
            <List.Item key={i.type}>
              {`${i.visningstekst}${i.type === INNHOLD_TYPE_ANNET ? ': ' + i.beskrivelse : ''}`}
            </List.Item>
          ))}
      </List>
      <div className="mt-4">
        <Heading level="2" size="medium">
          Bakgrunnsinformasjon
        </Heading>
        <BodyLong size="small" className="mt-2">
          {bakgrunnsinformasjon}
        </BodyLong>
      </div>
    </VStack>
  )
}
