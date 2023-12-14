import {Heading, VStack} from '@navikt/ds-react'
import {Deltakerliste, Mal} from '../api/data/pamelding'
import {ArrangørInfo} from './ArrangørInfo'
import {PameldingSkjema} from './PameldingSkjema'

export interface PameldingProps {
    deltakerliste: Deltakerliste,
    mal: Array<Mal>
}

export const Pamelding = ({deltakerliste, mal}: PameldingProps) => {
  return (
    <VStack gap="8" className="p-6 bg-white">
      <Heading level="1" size="medium">
                Meld på {deltakerliste.deltakerlisteNavn} hos {deltakerliste.arrangorNavn}
      </Heading>
      <ArrangørInfo
        arrangorNavn={deltakerliste.arrangorNavn}
        oppstartsType={deltakerliste.oppstartstype}
      />
      <PameldingSkjema mal={mal} tiltakstype={deltakerliste.tiltakstype}/>
    </VStack>
  )
}
