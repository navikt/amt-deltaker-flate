import { Box, Heading, VStack } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { Forslag } from '../../model/forslag'
import { ForslagDetaljer } from './ForslagDetaljer'

interface ForslagInfoProps {
  children: ReactNode
}

export function ForslagInfo({ children }: ForslagInfoProps) {
  return (
    <Box
      background="bg-subtle"
      padding={{ xs: '2', md: '4' }}
      borderRadius="medium"
      className="mt-4"
    >
      <VStack gap="4">
        <Heading level="2" size="medium">
          Arrangør foreslår en endring:
        </Heading>
        {children}
      </VStack>
    </Box>
  )
}

interface AktivtForslagBoxProps {
  forslag: Forslag
  children?: ReactNode
}
export function AktivtForslagBox({ forslag, children }: AktivtForslagBoxProps) {
  return (
    <Box
      background="surface-default"
      borderColor="border-default"
      borderWidth="1"
      borderRadius="medium"
    >
      <ForslagDetaljer forslag={forslag} />
      {children}
    </Box>
  )
}
