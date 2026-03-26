import { BodyLong, Button, LocalAlert, Modal } from '@navikt/ds-react'
import { DeferredFetchState, useDeferredFetch } from 'deltaker-flate-common'
import { deleteKladd } from '../../../../api/api.ts'
import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../../../../hooks/useModiaLink.ts'
import { usePameldingContext } from '../../../tiltak/PameldingContext.tsx'

interface Props {
  open: boolean
  onClose: () => void
}

export const SlettKladdModal = ({ open, onClose }: Props) => {
  const { pamelding } = usePameldingContext()

  const { doRedirect } = useModiaLink()
  const returnToFrontpage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK)
  }
  const {
    state: slettKladdState,
    error,
    doFetch: doFetchSlettKladd
  } = useDeferredFetch(deleteKladd, returnToFrontpage)

  return (
    <Modal
      open={open}
      header={{
        heading: 'Vil du slette kladden?'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        <BodyLong size="small">
          Påmeldingen og det du har skrevet vil bli borte.
        </BodyLong>

        {error && (
          <LocalAlert className="mt-8 -mb-4" status="error" size="small">
            <LocalAlert.Header>
              <LocalAlert.Title>
                Vi fikk en feil og kunne ikke slette kladden, prøv igjen.
              </LocalAlert.Title>
            </LocalAlert.Header>
          </LocalAlert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="small"
          onClick={() => {
            doFetchSlettKladd(pamelding.deltakerId).then(() => {
              onClose()
            })
          }}
          disabled={slettKladdState === DeferredFetchState.LOADING}
          loading={slettKladdState === DeferredFetchState.LOADING}
        >
          Slett kladd
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={onClose}
          disabled={slettKladdState === DeferredFetchState.LOADING}
        >
          Nei, ikke slett
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
