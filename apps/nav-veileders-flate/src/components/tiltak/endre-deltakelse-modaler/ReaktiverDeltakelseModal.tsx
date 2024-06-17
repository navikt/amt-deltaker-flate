import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { useState } from 'react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { endreDeltakelseReaktiver } from '../../../api/api.ts'
import { BodyLong, ConfirmationPanel, Detail, Modal } from '@navikt/ds-react'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import { ModalFooter } from '../../ModalFooter.tsx'
import { getEndrePameldingTekst } from '../../../utils/displayText.ts'

interface ReaktiverDeltakelseModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const ReaktiverDeltakelseModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: ReaktiverDeltakelseModalProps) => {
  const { enhetId } = useAppContext()
  const [confirmed, setConfirmed] = useState(false)
  const [hasError, setHasError] = useState<boolean>(false)

  const handleChangeConfirm = () => {
    setConfirmed((oldValue) => !oldValue)
    setHasError(false)
  }

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseReaktiver
  } = useDeferredFetch(endreDeltakelseReaktiver)

  const sendEndring = () => {
    if (confirmed) {
      doFetchEndreDeltakelseReaktiver(pamelding.deltakerId, enhetId).then(
        (data) => {
          onSuccess(data)
        }
      )
    } else {
      setHasError(true)
    }
  }

  return (
    <Modal
      open={open}
      header={{
        icon: (
          <EndringTypeIkon type={EndreDeltakelseType.REAKTIVER_DELTAKELSE} />
        ),
        heading: 'Endre til aktiv deltakelse'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <ErrorPage message={endreDeltakelseError} />
        )}
        <Detail size="small">
          {getEndrePameldingTekst(pamelding.digitalBruker)}
        </Detail>
        <ConfirmationPanel
          className="mt-6"
          size="small"
          checked={confirmed}
          onChange={handleChangeConfirm}
          error={hasError && 'Du må bekrefte før du kan fortsette.'}
          label="Ja, brukeren skal delta likevel"
        >
          <BodyLong size="small">
            Skal brukeren delta på tiltaket likevel?
            <br />
            Statusen settes tilbake til “venter på oppstart” og brukeren mottar
            informasjon om påmeldingen.
          </BodyLong>
        </ConfirmationPanel>
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
