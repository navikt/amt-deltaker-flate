import { BodyLong, Button, Modal } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { useEffect } from 'react'
import { avbrytUtkast } from '../../api/api.ts'
import { useAppContext } from '../../AppContext.tsx'
import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../../hooks/useModiaLink.ts'
import { usePameldingFormContext } from '../pamelding/PameldingFormContext.tsx'
import { usePameldingContext } from '../tiltak/PameldingContext.tsx'

interface Props {
  open: boolean
  onClose: () => void
}

export const AvbrytUtkastDeltMedBrukerModal = ({ open, onClose }: Props) => {
  const { enhetId } = useAppContext()
  const { pamelding } = usePameldingContext()
  const { disabled, setDisabled } = usePameldingFormContext()

  const { doRedirect } = useModiaLink()
  const returnToFrontpage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK)
  }
  const {
    state: avbrytUtkastState,
    error: avbrytUtkastError, // TODO vise feilmelding
    doFetch: fetchAvbrytUtkast
  } = useDeferredFetch(avbrytUtkast, returnToFrontpage)

  useEffect(() => {
    setDisabled(avbrytUtkastState === DeferredFetchState.LOADING)
  }, [avbrytUtkastState])

  return (
    <Modal
      open={open}
      header={{ heading: 'Vil du avbryte utkastet?' }}
      onClose={onClose}
    >
      <Modal.Body>
        <BodyLong className="mb-4" size="small">
          Når du avbryter utkastet så får personen beskjed. Aktiviteten i
          aktivitetsplanen blir flyttet til avbrutt.
        </BodyLong>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex gap-4 items-center justify-start">
          <Button
            type="button"
            size="small"
            onClick={() => {
              fetchAvbrytUtkast(pamelding.deltakerId, enhetId).then(() => {
                onClose()
              })
            }}
            disabled={disabled}
            loading={avbrytUtkastState === DeferredFetchState.LOADING}
          >
            Avbryt utkast
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={onClose}
            disabled={disabled}
          >
            Nei, ikke avbryt utkastet
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
