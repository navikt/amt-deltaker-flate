/* eslint-disable react/jsx-no-undef */
import {
  AktivtForslag,
  ApiFunction,
  DeferredFetchState,
  EndreDeltakelseType,
  EndringTypeIkon,
  useDeferredFetch
} from 'deltaker-flate-common'
import { Detail, Modal } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { EndringRequest } from '../../../api/data/endre-deltakelse-request'
import { PameldingResponse } from '../../../api/data/pamelding'
import { useAppContext } from '../../../AppContext'
import { avvisForslag } from '../../../api/api'
import { ErrorPage } from '../../../pages/ErrorPage'
import { getEndrePameldingTekst } from '../../../utils/displayText'
import { ModalForslagDetaljer } from '../forslag/ModalForslagDetaljer'
import { ModalFooter } from '../../ModalFooter'

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
  const { enhetId } = useAppContext()
  const { doFetch: doFetchAvvisForslag } = useDeferredFetch(avvisForslag)
  const { state, error, doFetch } = useDeferredFetch(apiFunction)

  const sendEndring = () => {
    const request = validertRequest()
    if (request) {
      doFetch(request.deltakerId, request.enhetId, request.body).then((data) =>
        onSend(data)
      )
    }
  }

  const sendAvvisForslag = () => {
    if (forslag) {
      doFetchAvvisForslag(forslag.id, enhetId, {
        begrunnelse: 'Avvisning skal flyttes til sin egen modal, soon TM'
      }).then((data) => {
        onSend(data)
      })
    }
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
        <Detail>{getEndrePameldingTekst(digitalBruker)}</Detail>
        {forslag && <ModalForslagDetaljer forslag={forslag} />}

        {children}
      </Modal.Body>
      {!forslag && (
        <ModalFooter
          confirmButtonText="Lagre"
          onConfirm={sendEndring}
          confirmLoading={state === DeferredFetchState.LOADING}
          disabled={state === DeferredFetchState.LOADING}
        />
      )}
      {forslag && (
        <ModalFooter
          confirmButtonText="Lagre"
          onConfirm={sendEndring}
          cancelButtonText="Avvis forslag"
          onCancel={sendAvvisForslag}
          confirmLoading={state === DeferredFetchState.LOADING}
          disabled={state === DeferredFetchState.LOADING}
        />
      )}
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
    case EndreDeltakelseType.ENDRE_SLUTTDATO:
    case EndreDeltakelseType.ENDRE_OPPSTARTSDATO:
    case EndreDeltakelseType.FORLENG_DELTAKELSE:
    case EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE:
    case EndreDeltakelseType.REAKTIVER_DELTAKELSE:
    default:
      throw new Error(`Endringstekst for ${endringstype} er ikke implementert`)
  }
}
