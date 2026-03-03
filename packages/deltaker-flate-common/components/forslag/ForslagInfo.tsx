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
      background="neutral-moderate"
      padding={{ xs: 'space-8', md: 'space-16' }}
      borderRadius="4"
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
      background="default"
      borderColor="neutral"
      borderWidth="1"
      borderRadius="4"
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
      <VStack gap="space-16">
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
