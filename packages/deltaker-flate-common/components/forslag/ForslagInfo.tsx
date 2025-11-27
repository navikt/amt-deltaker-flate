import { Box, Heading, VStack } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { Forslag } from '../../model/forslag'
import { ForslagDetaljer } from './ForslagDetaljer'

interface EndringBoxProps {
  className?: string
  children: ReactNode
}

export const EndringerWrapper = ({ children, className }: EndringBoxProps) => {
  return (
    <Box
      background="bg-subtle"
      padding={{ xs: '2', md: '4' }}
      borderRadius="medium"
      className={className ?? ''}
    >
      {children}
    </Box>
  )
}

interface EndringBoxProps {
  className?: string
  children: ReactNode
}

export const EndringerBox = ({ children, className }: EndringBoxProps) => {
  return (
    <Box
      background="surface-default"
      borderColor="border-default"
      borderWidth="1"
      borderRadius="medium"
      className={className ?? ''}
    >
      {children}
    </Box>
  )
}

interface ForslagInfoProps {
  children: ReactNode
  className?: string
}

export function ForslagInfo({ children, className }: ForslagInfoProps) {
  return (
    <EndringerWrapper className={className ?? ''}>
      <VStack gap="4">
        <Heading level="2" size="medium">
          Arrangør foreslår en endring:
        </Heading>
        {children}
      </VStack>
    </EndringerWrapper>
  )
}

interface AktivtForslagBoxProps {
  forslag: Forslag
  children?: ReactNode
}
export function AktivtForslagBox({ forslag, children }: AktivtForslagBoxProps) {
  return (
    <EndringerBox>
      <ForslagDetaljer forslag={forslag} />
      {children}
    </EndringerBox>
  )
}
