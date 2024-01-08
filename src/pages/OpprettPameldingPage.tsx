import {OpprettPameldingHeader} from '../components/opprett-pamelding/OpprettPameldingHeader.tsx'
import {PameldingResponse} from '../api/data/pamelding.ts'
import {OpprettPameldingForm} from '../components/opprett-pamelding/OpprettPameldingForm.tsx'
import {useState} from 'react'

export interface OpprettPameldingPageProps {
    pamelding: PameldingResponse
}

export const OpprettPameldingPage = ({pamelding}: OpprettPameldingPageProps) => {
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false)
  const [sendSomForslagLoading, setSendSomForslagLoading] = useState<boolean>(false)
  const [sendDirekteLoading, setSendDirekteLoading] = useState<boolean>(false)

  const onSendSomForslagHandler = () => {
    setDisableSubmit(true)
    setSendSomForslagLoading(true)
    // console.log('SendSomForslag')
  }

  const onSendDirekteHandler = () => {
    setDisableSubmit(true)
    setSendDirekteLoading(true)
    // console.log('SendDirekte')
  }

  return (
    <div>
      <OpprettPameldingHeader
        deltakerlisteNavn={pamelding.deltakerliste.deltakerlisteNavn}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
        oppstartstype={pamelding.deltakerliste.oppstartstype}
      />
      <OpprettPameldingForm
        disableSubmit={disableSubmit}
        onSendSomForslag={onSendSomForslagHandler}
        sendSomForslagLoading={sendSomForslagLoading}
        onSendDirekte={onSendDirekteHandler}
        sendDirekteLoading={sendDirekteLoading}
      />
    </div>
  )

}
