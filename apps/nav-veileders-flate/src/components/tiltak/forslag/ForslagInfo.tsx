import { AktivtForslag, ForslagDetaljer } from 'deltaker-flate-common'
import { Box, Heading, HStack, VStack } from '@navikt/ds-react'
import { BehandleForslagKnapp } from './BehandleForslagKnapp.tsx'

interface Props {
  forslag: AktivtForslag
}

export const ForslagInfo = ({ forslag }: Props) => {
  return (
    <Box
      background="bg-subtle"
      padding={{ xs: '2', md: '6' }}
      borderRadius={{ md: 'large' }}
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
          <Box
            background="surface-action-subtle"
            className="mt-6 p-2"
            borderRadius="0 0 large large"
          >
            <HStack gap="2" className="items-center">
              <Heading level="3" size="xsmall">
                For NAV-ansatt:
              </Heading>
              <BehandleForslagKnapp forslag={forslag} />
            </HStack>
          </Box>
        </Box>
      </VStack>
    </Box>
  )
}
