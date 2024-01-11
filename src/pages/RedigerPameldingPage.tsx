import {PameldingResponse} from '../api/data/pamelding.ts'
import {PameldingHeader} from '../components/pamelding/PameldingHeader.tsx'
import {RedigerPameldingHeader} from '../components/rediger-pamelding/RedigerPameldingHeader.tsx'
import {PameldingForm} from '../components/pamelding/PameldingForm.tsx'
import {generateFormDefaultValues} from '../model/PameldingFormValues.ts'

export interface RedigerPameldingPageProps {
    pamelding: PameldingResponse
}

export const RedigerPameldingPage = ({pamelding}: RedigerPameldingPageProps) => {
  return (
    <div className="space-y-4">
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

      <div>
        <PameldingForm
          disableButtonsAndForm={false}
          onSendSomForslag={() => {
          }}
          sendSomForslagLoading={false}
          onSendDirekte={() => {
          }}
          sendDirekteLoading={false}
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          mal={pamelding.mal}
          defaultValues={generateFormDefaultValues(pamelding)}
          bakgrunnsinformasjon={pamelding.bakgrunnsinformasjon ?? undefined}
          deltakelsesprosent={pamelding.deltakelsesprosent ?? undefined}
          dagerPerUke={pamelding.dagerPerUke ?? undefined}
        />
      </div>
    </div>

  )
}
