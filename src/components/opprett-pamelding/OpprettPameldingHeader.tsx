import {Heading, VStack} from '@navikt/ds-react'
import {ArrangorInfo} from '../../pages/pamelding/components/ArrangorInfo.tsx'

interface Props {
    deltakerlisteNavn: string;
    arrangorNavn: string;
    oppstartstype: string;
}

export const OpprettPameldingHeader = ({deltakerlisteNavn, arrangorNavn, oppstartstype}: Props) => {
  return (
    <VStack gap="8" className="p-6 bg-white">
      <Heading level="1" size="medium">
                Meld på {deltakerlisteNavn} hos {arrangorNavn}
      </Heading>
      <ArrangorInfo
        arrangorNavn={arrangorNavn}
        oppstartsType={oppstartstype}
      />
    </VStack>
  )
}
