import {PameldingResponse} from '../api/data/pamelding.ts'
import {PameldingHeader} from '../components/pamelding/PameldingHeader.tsx'
import {RedigerPameldingHeader} from '../components/rediger-pamelding/RedigerPameldingHeader.tsx'

export interface RedigerPameldingPageProps {
    pamelding: PameldingResponse
}

export const RedigerPameldingPage = ({pamelding}: RedigerPameldingPageProps) => {
  return (
    <div>
      <PameldingHeader
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
      />
      <RedigerPameldingHeader
        status={pamelding.status.type}
        endretAv={pamelding.sistEndretAv}
      />
    </div>
  )
}
