import { Box, Detail, HStack, Label, VStack } from '@navikt/ds-react'

export interface ArrangørInfoProps {
  arrangorNavn: string
  oppstartsType: string
}

export const ArrangørInfo = ({ arrangorNavn, oppstartsType }: ArrangørInfoProps) => {
  return (
    <Box padding="4" background="surface-subtle" borderRadius="large">
      <HStack gap="6">
        <VStack gap="2">
          <Label>Arrangør</Label>
          <Detail>{arrangorNavn}</Detail>
        </VStack>
        <VStack gap="2">
          <Label>Oppstart</Label>
          <Detail>{oppstartsType}</Detail>
        </VStack>
      </HStack>
    </Box>
  )
}
