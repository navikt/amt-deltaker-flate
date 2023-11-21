import { Heading, VStack } from '@navikt/ds-react'
import { type Mal } from '../api/data/pamelding'
import { ArrangørInfo } from './ArrangørInfo'
import { PameldingSkjema } from './PameldingSkjema'

export interface PameldingProps {
  deltakerlisteNavn: string
  arrangorNavn: string
  oppstartsType: string
  mal: Array<Mal>
  bakgrunnsinformasjon?: string
}

export const Pamelding = ({
  deltakerlisteNavn,
  arrangorNavn,
  oppstartsType,
  mal,
  bakgrunnsinformasjon
}: PameldingProps) => {
  return (
    <VStack gap="8" className="p-6 bg-white">
      <Heading level="1" size="medium">
        Meld på {deltakerlisteNavn} hos {arrangorNavn}
      </Heading>
      <ArrangørInfo arrangorNavn={arrangorNavn} oppstartsType={oppstartsType} />
      <PameldingSkjema
        deltakerlisteNavn={deltakerlisteNavn}
        mal={mal}
        bakgrunnsinformasjon={bakgrunnsinformasjon}
      />
    </VStack>
  )
}
