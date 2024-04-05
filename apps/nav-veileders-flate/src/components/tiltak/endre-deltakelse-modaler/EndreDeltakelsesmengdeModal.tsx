import { Detail, Modal } from '@navikt/ds-react'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useState } from 'react'
import {
  DeferredFetchState,
  useDeferredFetch
} from '../../../hooks/useDeferredFetch.ts'
import { endreDeltakelsesmengde } from '../../../api/api.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { ModalFooter } from '../../ModalFooter.tsx'
import { NumberTextField } from '../../NumberTextField.tsx'
import { dagerPerUkeFeilmelding } from '../../../model/PameldingFormValues.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'

interface EndreDeltakelsesmengdeModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreDeltakelsesmengdeModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreDeltakelsesmengdeModalProps) => {
  const [deltakelsesprosent, setDeltakelsesprosent] = useState<number | null>(
    null
  )
  const [dagerPerUke, setDagerPerUke] = useState<number | null>(null)
  const [hasErrorDeltakelsesprosent, setHasErrorDeltakelsesprosent] =
    useState<boolean>(false)
  const [hasErrorDagerPerUke, setHasErrorDagerPerUke] = useState<boolean>(false)

  const gyldigDeltakelsesprosent =
    !deltakelsesprosent || (0 < deltakelsesprosent && deltakelsesprosent <= 100)
  const gyldigDagerPerUke =
    !dagerPerUke || (0 < dagerPerUke && dagerPerUke <= 5)

  const { enhetId } = useAppContext()

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelsesmengde
  } = useDeferredFetch(endreDeltakelsesmengde)

  const sendEndring = () => {
    if (gyldigDeltakelsesprosent) {
      if (gyldigDagerPerUke) {
        doFetchEndreDeltakelsesmengde(pamelding.deltakerId, enhetId, {
          deltakelsesprosent: deltakelsesprosent || undefined,
          dagerPerUke: dagerPerUke || undefined
        }).then((data) => {
          onSuccess(data)
        })
      } else setHasErrorDagerPerUke(true)
    } else setHasErrorDeltakelsesprosent(true)
  }

  return (
    <Modal
      open={open}
      header={{
        icon: (
          <EndringTypeIkon type={EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE} />
        ),
        heading: 'Endre deltakelsesmengde'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <ErrorPage message={endreDeltakelseError} />
        )}
        <Detail size="small" className="mb-4">
          Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser også
          endringen.
        </Detail>
        <NumberTextField
          label="Hva er ny deltakelsesprosent?"
          disabled={false}
          value={deltakelsesprosent || undefined}
          onChange={(e) => {
            setDeltakelsesprosent(e || null)
            setHasErrorDeltakelsesprosent(false)
          }}
          error={
            hasErrorDeltakelsesprosent &&
            !gyldigDeltakelsesprosent &&
            'Deltakelsesprosent må være et helt tall fra 1 til 100'
          }
          required
          id="deltakelsesprosent"
          className="[&>input]:w-16 mt-4"
        />
        {deltakelsesprosent && deltakelsesprosent != 100 && (
          <NumberTextField
            label="Hvor mange dager i uka? (valgfritt)"
            disabled={false}
            value={dagerPerUke || undefined}
            onChange={(e) => {
              setDagerPerUke(e || null)
              setHasErrorDagerPerUke(false)
            }}
            error={
              hasErrorDagerPerUke &&
              !gyldigDagerPerUke &&
              dagerPerUkeFeilmelding
            }
            className="[&>input]:w-16 mt-4"
            id="dagerPerUke"
          />
        )}
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Lagre"
        onConfirm={sendEndring}
        confirmLoading={endreDeltakelseState === DeferredFetchState.LOADING}
        disabled={endreDeltakelseState === DeferredFetchState.LOADING}
      />
    </Modal>
  )
}
