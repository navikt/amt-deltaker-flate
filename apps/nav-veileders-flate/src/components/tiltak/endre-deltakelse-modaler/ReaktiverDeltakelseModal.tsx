import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { useState } from 'react'
import {
  DeferredFetchState,
  EndreDeltakelseType,
  useDeferredFetch
} from 'deltaker-flate-common'
import { endreDeltakelseReaktiver } from '../../../api/api.ts'
import {
  BodyLong,
  ConfirmationPanel,
  Detail,
  Modal,
  Textarea
} from '@navikt/ds-react'
import { EndringTypeIkon } from 'deltaker-flate-common'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import { ModalFooter } from '../../ModalFooter.tsx'
import { getEndrePameldingTekst } from '../../../utils/displayText.ts'
import { BEGRUNNELSE_MAKS_TEGN } from '../../../model/PameldingFormValues.ts'

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
  const [begrunnelse, setBegrunnelse] = useState<string | null>()
  const [errorBegrunnelse, setErrorBegrunnelse] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [errorConfirmed, setErrorConfirmed] = useState<string | null>(null)

  const harForLangBegrunnelse =
    begrunnelse && begrunnelse.length > BEGRUNNELSE_MAKS_TEGN

  const handleChangeConfirm = () => {
    setConfirmed((oldValue) => !oldValue)
    setErrorConfirmed(null)
  }

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseReaktiver
  } = useDeferredFetch(endreDeltakelseReaktiver)

  const sendEndring = () => {
    let hasError = false
    if (!confirmed) {
      setErrorConfirmed('Du må bekrefte før du kan fortsette.')
      hasError = true
    }

    if (!begrunnelse) {
      setErrorBegrunnelse(
        'Du må begrunne hvorfor deltakeren skal endres til aktiv'
      )
      hasError = true
    }
    if (harForLangBegrunnelse) {
      setErrorBegrunnelse(
        `Begrunnelsen kan ikke være mer enn ${BEGRUNNELSE_MAKS_TEGN} tegn`
      )
      hasError = true
    }
    if (!hasError && confirmed && begrunnelse) {
      doFetchEndreDeltakelseReaktiver(pamelding.deltakerId, enhetId, {
        begrunnelse: begrunnelse
      }).then((data) => {
        onSuccess(data)
      })
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
          error={errorConfirmed}
          label="Ja, brukeren skal delta likevel"
        >
          <BodyLong size="small">
            Skal brukeren delta på tiltaket likevel? Statusen settes tilbake til
            “venter på oppstart” og brukeren mottar informasjon om påmeldingen.
          </BodyLong>
        </ConfirmationPanel>
        <Textarea
          onChange={(e) => {
            setBegrunnelse(e.target.value)
            setErrorBegrunnelse(null)
          }}
          error={errorBegrunnelse}
          className="mt-6"
          label="Begrunnelse for endringen"
          description="Beskriv kort hvorfor endringen er riktig for personen."
          value={begrunnelse ?? ''}
          maxLength={BEGRUNNELSE_MAKS_TEGN}
          id="begrunnelse"
          size="small"
          aria-label={'Begrunnelse'}
        />
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
