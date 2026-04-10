import { PencilIcon } from '@navikt/aksel-icons'
import { Alert, Button, Dropdown } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { DeltakerResponse } from '../../api/data/deltaker.ts'
import { getEndreDeltakelsesValg } from '../../utils/endreDeltakelse.ts'
import {
  Forslag,
  EndreDeltakelseType,
  EndringTypeIkon,
  getEndreDeltakelseTypeText,
  getEndreDeltakelsesType
} from 'deltaker-flate-common'
import { useDeltakerContext } from './DeltakerContext.tsx'
import { ModalController } from './endre-deltakelse-modaler/ModalController.tsx'
import { useFeatureToggles } from '../../hooks/useFeatureToggles.ts'

export const EndreDeltakelseKnapp = () => {
  const { deltaker, setDeltaker } = useDeltakerContext()
  const endreDeltakelseRef = useRef<HTMLButtonElement>(null)
  const [modalType, setModalType] = useState<EndreDeltakelseType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [forslag, setForslag] = useState<Forslag | null>(null)
  const { erKometMasterForTiltak } = useFeatureToggles()
  const enableEndreDeltakelse = erKometMasterForTiltak(
    deltaker.deltakerliste.tiltakskode
  )

  const openModal = (type: EndreDeltakelseType) => {
    setModalType(type)
    setModalOpen(true)
    setForslag(
      deltaker.forslag.filter(
        (f) => getEndreDeltakelsesType(f.endring) === type
      )[0] ?? null
    )
  }

  const handleCloseModal = () => {
    setModalType(null)
    setModalOpen(false)
    endreDeltakelseRef?.current?.focus()
  }

  const handleEndringUtført = (oppdatertPamelding: DeltakerResponse | null) => {
    handleCloseModal()
    if (oppdatertPamelding) {
      setDeltaker(oppdatertPamelding)
    }
  }

  if (deltaker.importertFraArena && !enableEndreDeltakelse) {
    return (
      <Alert inline variant="info">
        For å endre aktiviteten må du gå til Arena.
      </Alert>
    )
  }

  if (!enableEndreDeltakelse) {
    return null
  }

  return (
    <>
      <Dropdown>
        <Button
          ref={endreDeltakelseRef}
          as={Dropdown.Toggle}
          variant="secondary"
          size="small"
          className="w-fit"
          data-testid="endre_deltakelse_knapp"
          icon={<PencilIcon aria-hidden />}
        >
          Endre deltakelse
        </Button>

        <Dropdown.Menu>
          <Dropdown.Menu.List>
            {getEndreDeltakelsesValg(deltaker).map((valgType) => (
              <Dropdown.Menu.List.Item
                key={valgType}
                onClick={() => openModal(valgType)}
              >
                <EndringTypeIkon type={valgType} />
                {getEndreDeltakelseTypeText(valgType)}
              </Dropdown.Menu.List.Item>
            ))}
          </Dropdown.Menu.List>
        </Dropdown.Menu>
      </Dropdown>

      <ModalController
        endringsType={modalType}
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleEndringUtført}
        pamelding={deltaker}
        forslag={forslag}
      />
    </>
  )
}
