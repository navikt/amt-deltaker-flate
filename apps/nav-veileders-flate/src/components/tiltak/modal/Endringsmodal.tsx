import {
  AktivtForslag,
  ApiFunction,
  DeferredFetchState,
  EndreDeltakelseType,
  EndringTypeIkon,
  useDeferredFetch
} from 'deltaker-flate-common'
import { Detail, Modal } from '@navikt/ds-react'
import { ReactNode, useState } from 'react'
import { EndringRequest } from '../../../api/data/endre-deltakelse-request'
import { PameldingResponse } from '../../../api/data/pamelding'
import { ErrorPage } from '../../../pages/ErrorPage'
import { getEndrePameldingTekst } from '../../../utils/displayText'
import { ModalForslagDetaljer } from '../forslag/ModalForslagDetaljer'
import { ModalFooter } from '../../ModalFooter'
import Avvisningsmodal from './Avvisningsmodal'

export type EndringsmodalRequest<T extends EndringRequest> = {
  deltakerId: string
  enhetId: string
  body: T
}

interface Props<T extends EndringRequest> {
  open: boolean
  endringstype: EndreDeltakelseType
  digitalBruker: boolean
  onClose: () => void
  onSend: (oppdatertPamelding: PameldingResponse | null) => void
  apiFunction: ApiFunction<PameldingResponse | null, [string, string, T]>
  validertRequest: () => EndringsmodalRequest<T> | null
  forslag: AktivtForslag | null
  children: ReactNode
}
export function Endringsmodal<T extends EndringRequest>({
  open,
  endringstype,
  digitalBruker,
  onSend,
  onClose,
  apiFunction,
  validertRequest,
  forslag,
  children
}: Props<T>) {
  const { state, error, doFetch } = useDeferredFetch(apiFunction)
  const [visAvvisningsmodal, setAvvisningsmodal] = useState(false)

  const sendEndring = () => {
    const request = validertRequest()
    if (request) {
      doFetch(request.deltakerId, request.enhetId, request.body).then((data) =>
        onSend(data)
      )
    }
  }

  if (visAvvisningsmodal && forslag) {
    return (
      <Avvisningsmodal
        open={open}
        onSend={onSend}
        onClose={onClose}
        forslag={forslag}
      />
    )
  }

  return (
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={endringstype} />,
        heading: endringstekst(endringstype)
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {state === DeferredFetchState.ERROR && <ErrorPage message={error} />}
        <Detail className="mb-4">
          {getEndrePameldingTekst(digitalBruker)}
        </Detail>
        {forslag && (
          <ModalForslagDetaljer
            forslag={forslag}
            onClick={() => setAvvisningsmodal(true)}
          />
        )}

        {children}
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Lagre"
        onConfirm={sendEndring}
        confirmLoading={state === DeferredFetchState.LOADING}
        disabled={state === DeferredFetchState.LOADING}
      />
    </Modal>
  )
}

function endringstekst(endringstype: EndreDeltakelseType) {
  switch (endringstype) {
    case EndreDeltakelseType.IKKE_AKTUELL:
      return 'Er ikke aktuell'
    case EndreDeltakelseType.ENDRE_SLUTTARSAK:
      return 'Endre sluttårsak'
    case EndreDeltakelseType.AVSLUTT_DELTAKELSE:
      return 'Avslutt deltakelse'
    case EndreDeltakelseType.ENDRE_INNHOLD:
      return 'Endre innhold'
    case EndreDeltakelseType.ENDRE_BAKGRUNNSINFO:
      return 'Endre bakgrunnsinfo'
    case EndreDeltakelseType.ENDRE_SLUTTDATO:
      return 'Endre sluttdato'
    case EndreDeltakelseType.ENDRE_OPPSTARTSDATO:
      return 'Endre oppstartsdato'
    case EndreDeltakelseType.FORLENG_DELTAKELSE:
      return 'Forleng deltakelse'
    case EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE:
      return 'Endre deltakelsesmengde'
    case EndreDeltakelseType.REAKTIVER_DELTAKELSE:
      return 'Endre til aktiv deltakelse'
    default:
      throw new Error(`Endringstekst for ${endringstype} er ikke implementert`)
  }
}
