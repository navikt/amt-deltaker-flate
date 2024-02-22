import { BodyLong, Heading, List, VStack } from '@navikt/ds-react'
import { Deltakelsesinnhold } from '../../api/data/pamelding.ts'
import { EMDASH, INNHOLD_TYPE_ANNET } from '../../utils/utils.ts'

interface Props {
  innhold: Deltakelsesinnhold | null
  bakgrunnsinformasjon: string | null
}

export const Utkast = ({ innhold, bakgrunnsinformasjon }: Props) => {
  const bakgrunnsinfoVisningstekst =
    bakgrunnsinformasjon && bakgrunnsinformasjon.length > 0 ? bakgrunnsinformasjon : EMDASH

  return (
    <VStack gap="4">
      <Heading level="2" size="medium">
        Hva er innholdet?
      </Heading>
      <BodyLong size="small">{innhold?.ledetekst ?? ''}</BodyLong>
      {innhold?.innhold && (
        <List as="ul" size="small">
          {innhold.innhold
            .filter((i) => i.valgt)
            .map((i) => (
              <List.Item key={i.innholdskode}>
                {`${i.tekst}${i.innholdskode === INNHOLD_TYPE_ANNET ? ': ' + i.beskrivelse : ''}`}
              </List.Item>
            ))}
        </List>
      )}
      <div className="mt-4">
        <Heading level="2" size="medium">
          Bakgrunnsinformasjon
        </Heading>
        <BodyLong size="small" className="mt-2">
          {bakgrunnsinfoVisningstekst}
        </BodyLong>
      </div>
    </VStack>
  )
}
