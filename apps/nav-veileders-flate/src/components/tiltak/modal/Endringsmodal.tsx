import { Alert, BodyLong, Heading, Modal } from '@navikt/ds-react'
import {
  ApiFunction,
  DeferredFetchState,
  EndreDeltakelseType,
  EndringTypeIkon,
  Forslag,
  useDeferredFetch
} from 'deltaker-flate-common'
import { ReactNode, useState } from 'react'
import { EndringRequest } from '../../../api/data/endre-deltakelse-request'
import { PameldingResponse } from '../../../api/data/pamelding'
import { getEndrePameldingTekst } from '../../../utils/displayText'
import { ModalFooter } from '../../ModalFooter'
import { ModalForslagDetaljer } from '../forslag/ModalForslagDetaljer'

export type EndringsmodalRequest<T extends EndringRequest> = {
  deltakerId: string
  enhetId: string
  body: T
}

interface Props<T extends EndringRequest> {
  open: boolean
  endringstype: EndreDeltakelseType
  deltaker: PameldingResponse
  onClose: () => void
  onSend: (oppdatertPamelding: PameldingResponse | null) => void
  apiFunction: ApiFunction<PameldingResponse | null, [string, string, T]>
  validertRequest: () => EndringsmodalRequest<T> | null
  forslag: Forslag | null
  children: ReactNode
}
export function Endringsmodal<T extends EndringRequest>({
  open,
  endringstype,
  deltaker,
  onSend,
  onClose,
  apiFunction,
  validertRequest,
  forslag,
  children
}: Props<T>) {
  return (
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={endringstype} />,
        heading: endringstekst(endringstype)
      }}
      onClose={onClose}
      className="w-[600px]"
    >
      <EndringsmodalBody
        onSend={onSend}
        apiFunction={apiFunction}
        validertRequest={validertRequest}
        forslag={forslag}
        deltaker={deltaker}
      >
        {children}
      </EndringsmodalBody>
    </Modal>
  )
}

interface EndrinsmodalBodyProps<T extends EndringRequest> {
  onSend: (oppdatertPamelding: PameldingResponse | null) => void
  apiFunction: ApiFunction<PameldingResponse | null, [string, string, T]>
  validertRequest: () => EndringsmodalRequest<T> | null
  forslag: Forslag | null
  deltaker: PameldingResponse
  children: ReactNode
}
function EndringsmodalBody<T extends EndringRequest>({
  onSend,
  apiFunction,
  validertRequest,
  forslag,
  deltaker,
  children
}: EndrinsmodalBodyProps<T>) {
  const { state, error, doFetch } = useDeferredFetch(apiFunction)
  const [valideringsError, setValideringsError] = useState<string>()

  const sendEndring = () => {
    try {
      const request = validertRequest()
      if (request) {
        doFetch(request.deltakerId, request.enhetId, request.body).then(
          (data) => onSend(data)
        )

        setValideringsError(undefined)
      }
    } catch (e) {
      if (e as Error) setValideringsError((e as Error).message)
    }
  }

  return (
    <>
      <Modal.Body>
        <Alert className="mb-6" variant="info" size="small">
          {getEndrePameldingTekst(deltaker)}
        </Alert>
        {forslag && <ModalForslagDetaljer forslag={forslag} />}

        {!deltaker.erUnderOppfolging && (
          <Alert variant="error" size="small" className="mb-6">
            <Heading level="2" size="xsmall">
              Det kan ikke gjøres endringer på deltakelsen
            </Heading>
            Brukeren er ikke registrert som “under oppfølging”. Det må fattes et
            14a-vedtak før deltakelsen på tiltaket kan endres.
          </Alert>
        )}

        {children}
        {!deltaker.digitalBruker && !deltaker.harAdresse && (
          <div className="flex items-center mt-4">
            <Alert variant="warning" size="small">
              <BodyLong className="mt-1" size="small">
                Personen er reservert mot digital kommunikasjon, og har heller
                ingen registrert kontaktadresse. De vil derfor ikke motta et
                varsel om vedtaket. Vedtaket som journalføres i Gosys må skrives
                ut og leveres til personen på annen måte.
              </BodyLong>
            </Alert>
          </div>
        )}
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Lagre"
        onConfirm={sendEndring}
        confirmLoading={state === DeferredFetchState.LOADING}
        disabled={
          state === DeferredFetchState.LOADING || !deltaker.erUnderOppfolging
        }
        error={valideringsError ?? error ?? undefined}
      />
    </>
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
    case EndreDeltakelseType.FJERN_OPPSTARTSDATO:
      return 'Fjern oppstartsdato'
    case EndreDeltakelseType.ENDRE_AVSLUTNING:
      return 'Endre avslutning'
    default:
      throw new Error(`Endringstekst for ${endringstype} er ikke implementert`)
  }
}
