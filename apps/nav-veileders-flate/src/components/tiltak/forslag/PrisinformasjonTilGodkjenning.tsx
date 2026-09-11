import { Alert, BodyLong, Box, Button, Dialog, Heading } from '@navikt/ds-react'
import {
  DeferredFetchState,
  Prisinformasjon,
  PrisinformasjonTilGodkjenningForslag,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import { tilbakekallPrisendring } from '../../../api/api-enkeltplass.ts'
import { DeltakerResponse } from '../../../api/data/deltaker.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { useDeltakerContext } from '../DeltakerContext.tsx'
import { EndrePrisinfoModal } from '../endre-deltakelse-modaler/EndrePrisinfoModal.tsx'

export const PrisinformasjonTilGodkjenning = ({
  prisinformasjonTilGodkjenning,
  className
}: {
  prisinformasjonTilGodkjenning: Prisinformasjon
  className?: string
}) => {
  const { enhetId } = useAppContext()
  const { deltaker, setDeltaker } = useDeltakerContext()
  const [endreModalOpen, setEndreModalOpen] = useState(false)
  const [tilbakekallDialogOpen, setTilbakekallDialogOpen] = useState(false)

  const {
    state: tilbakekallState,
    error: tilbakekallFeil,
    doFetch: doTilbakekall
  } = useDeferredFetch(tilbakekallPrisendring)

  const handleEndringUtfort = (oppdatertDeltaker: DeltakerResponse | null) => {
    setEndreModalOpen(false)
    if (oppdatertDeltaker) {
      setDeltaker(oppdatertDeltaker)
    }
  }

  const handleTilbakekall = () => {
    doTilbakekall(deltaker.deltakerId, enhetId)
      .then(() => {
        setDeltaker((prev) => ({
          ...prev,
          deltakerliste: {
            ...prev.deltakerliste,
            prisinformasjonTilGodkjenning: null
          }
        }))
      })
      .catch(() => {
        // Feil vises via tilbakekallFeil
      })
  }

  return (
    <div className={className ?? ''}>
      <PrisinformasjonTilGodkjenningForslag
        prisinformasjonTilGodkjenning={prisinformasjonTilGodkjenning}
      >
        <Box
          className="bg-(--ax-bg-accent-moderate) p-2"
          borderRadius="0 0 4 4"
        >
          <div className="flex items-center">
            <Heading level="3" size="xsmall">
              For Nav-ansatt:
            </Heading>
            <Button
              size="small"
              variant="primary"
              className="ml-4"
              onClick={() => setEndreModalOpen(true)}
              disabled={!deltaker.kanEndres}
            >
              Endre forslag
            </Button>
            <Button
              size="small"
              variant="secondary"
              className="ml-2"
              onClick={() => setTilbakekallDialogOpen(true)}
              loading={tilbakekallState === DeferredFetchState.LOADING}
            >
              Tilbakekall forslag
            </Button>
          </div>
          {tilbakekallFeil && (
            <Alert size="small" variant="error" className="mt-2">
              Kunne ikke tilbakekalle forslaget. Prøv igjen.
            </Alert>
          )}
        </Box>
      </PrisinformasjonTilGodkjenningForslag>

      {endreModalOpen && (
        <EndrePrisinfoModal
          open={endreModalOpen}
          onClose={() => setEndreModalOpen(false)}
          onSuccess={handleEndringUtfort}
          deltaker={deltaker}
          initialPrisinformasjon={prisinformasjonTilGodkjenning}
        />
      )}

      <Dialog
        open={tilbakekallDialogOpen}
        onOpenChange={(open) => setTilbakekallDialogOpen(open)}
      >
        <Dialog.Popup
          width="small"
          role="alertdialog"
          closeOnOutsideClick={false}
        >
          <Dialog.Header>
            <Dialog.Title>Tilbakekall forslag</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <BodyLong>
              Er du helt sikker på at du vil tilbakekalle forslaget?
            </BodyLong>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger>
              <Button variant="secondary" data-color="neutral" size="small">
                Nei, avbryt
              </Button>
            </Dialog.CloseTrigger>
            <Dialog.CloseTrigger>
              <Button
                variant="danger"
                size="small"
                loading={tilbakekallState === DeferredFetchState.LOADING}
                onClick={handleTilbakekall}
              >
                Ja, tilbakekall
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog>
    </div>
  )
}
