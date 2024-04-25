import { Detail, Modal, Textarea } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseBakgrunnsinfo } from '../../../api/api.ts'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { BAKGRUNNSINFORMASJON_MAKS_TEGN } from '../../../model/PameldingFormValues.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import { ModalFooter } from '../../ModalFooter.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'

interface EndreBakgrunnsinfoModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreBakgrunnsinfoModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreBakgrunnsinfoModalProps) => {
  const { enhetId } = useAppContext()
  const [bakgrunnsinformasjon, setBakgrunnsinformasjon] = useState<
    string | null
  >(pamelding.bakgrunnsinformasjon)

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseBakgrunnsinfo
  } = useDeferredFetch(endreDeltakelseBakgrunnsinfo)

  const sendEndring = () => {
    doFetchEndreDeltakelseBakgrunnsinfo(pamelding.deltakerId, enhetId, {
      bakgrunnsinformasjon
    }).then((data) => {
      onSuccess(data)
    })
  }

  return (
    <Modal
      open={open}
      header={{
        icon: (
          <EndringTypeIkon type={EndreDeltakelseType.ENDRE_BAKGRUNNSINFO} />
        ),
        heading: 'Endre bakgrunnsinfo'
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
        <Textarea
          onChange={(e) => {
            setBakgrunnsinformasjon(e.target.value)
          }}
          label="Er det noe mer dere ønsker å informere arrangøren om?"
          description="Er det noe rundt personens behov eller situasjon som kan påvirke deltakelsen på tiltaket?"
          value={bakgrunnsinformasjon ?? ''}
          maxLength={BAKGRUNNSINFORMASJON_MAKS_TEGN}
          id="bakgrunnsinformasjon"
          size="small"
          aria-label={'Bagrunnsinfo'}
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
