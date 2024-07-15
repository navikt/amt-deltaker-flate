import { AktivtForslag, ForslagDetaljer } from 'deltaker-flate-common'
import { Box, Heading, VStack } from '@navikt/ds-react'

interface Props {
  forslag: AktivtForslag
}

export const ForslagInfo = ({ forslag }: Props) => {
  return (
    <Box
      background="bg-subtle"
      padding={{ xs: '2', md: '6' }}
      borderRadius="small"
      className="mt-4"
    >
      <VStack gap="1">
        <Heading level="2" size="medium">
          Arrangør foreslår en endring:
        </Heading>
        <Box
          background="surface-default"
          borderColor="border-default"
          borderWidth="1"
          borderRadius={{ md: 'large' }}
        >
          <ForslagDetaljer forslag={forslag} />
        </Box>
      </VStack>
    </Box>
  )
}
