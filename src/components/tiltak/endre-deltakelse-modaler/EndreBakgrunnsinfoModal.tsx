import {
  Alert,
  BodyLong,
  Button,
  Heading,
  Modal,
  Textarea,
} from '@navikt/ds-react'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useState } from 'react'
import { DeferredFetchState, useDeferredFetch } from '../../../hooks/useDeferredFetch.ts'
import { endreDeltakelseBakgrunnsinfo } from '../../../api/api.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import {BAKGRUNNSINFORMASJON_MAKS_TEGN} from '../../../model/PameldingFormValues'

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
  const [bakgrunnsinfo, settNyBakgrunnsinfo] = useState<Date | null>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseBakgrunnsinfo
  } = useDeferredFetch(endreDeltakelseBakgrunnsinfo)

  const sendEndring = () => {
    doFetchEndreDeltakelseBakgrunnsinfo(pamelding.deltakerId, enhetId, {
      bakgrunnsinfo
    }).then((data) => {
      onSuccess(data)
    })
  }

  return (
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={EndreDeltakelseType.ENDRE_BAKGRUNNSINFO} />,
        heading: 'Endre Bakgrunnsinfo'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <Alert variant="error" className="mt-4 mb-4">
            <Heading size="small" spacing level="3">
              Det skjedde en feil.
            </Heading>
            {endreDeltakelseError}
          </Alert>
        )}
        <BodyLong size="small" className="mb-4">
          Er det noe mer dere ønsker å informere arrangøren om?
        </BodyLong>
        <BodyLong size="small" className="mb-4">
          Er det noe rundt personens behov eller situasjon som kan påvirke deltakelsen på tiltaket?
        </BodyLong>
        <Textarea
          label="Er det noe mer dere ønsker å informere arrangøren om?"
          description="Er det noe rundt personens behov eller situasjon som kan påvirke deltakelsen på tiltaket?"
          {...register('bakgrunnsinformasjon')}
          value={watch('bakgrunnsinformasjon')}
          error={!!errors.bakgrunnsinformasjon}
          disabled={isDisabled}
          maxLength={BAKGRUNNSINFORMASJON_MAKS_TEGN}
          id="bakgrunnsinformasjon"
          size="small"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          size="small"
          loading={endreDeltakelseState === DeferredFetchState.LOADING}
          disabled={endreDeltakelseState === DeferredFetchState.LOADING}
          onClick={sendEndring}
        >
          Oppdater
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
