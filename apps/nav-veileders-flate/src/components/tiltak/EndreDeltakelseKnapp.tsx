import { PencilIcon } from '@navikt/aksel-icons'
import { Alert, Button, Dropdown } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import { getEndreDeltakelsesValg } from '../../utils/endreDeltakelse.ts'
import {
  Forslag,
  EndreDeltakelseType,
  EndringTypeIkon,
  getEndreDeltakelseTypeText,
  getEndreDeltakelsesType
} from 'deltaker-flate-common'
import { usePameldingContext } from './PameldingContext.tsx'
import { ModalController } from './endre-deltakelse-modaler/ModalController.tsx'
import { useFeatureToggles } from '../../hooks/useFeatureToggles.ts'

export const EndreDeltakelseKnapp = () => {
  const { pamelding, setPamelding } = usePameldingContext()
  const endreDeltakelseRef = useRef<HTMLButtonElement>(null)
  const [modalType, setModalType] = useState<EndreDeltakelseType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [forslag, setForslag] = useState<Forslag | null>(null)
  const { erKometMasterForTiltak } = useFeatureToggles()
  const enableEndreDeltakelse = erKometMasterForTiltak(
    pamelding.deltakerliste.tiltakskode
  )

  const openModal = (type: EndreDeltakelseType) => {
    setModalType(type)
    setModalOpen(true)
    setForslag(
      pamelding.forslag.filter(
        (f) => getEndreDeltakelsesType(f.endring) === type
      )[0] ?? null
    )
  }

  const handleCloseModal = () => {
    setModalType(null)
    setModalOpen(false)
    endreDeltakelseRef?.current?.focus()
  }

  const handleEndringUtført = (
    oppdatertPamelding: PameldingResponse | null
  ) => {
    handleCloseModal()
    if (oppdatertPamelding) {
      setPamelding(oppdatertPamelding)
    }
  }

  if (pamelding.importertFraArena && !enableEndreDeltakelse) {
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
            {getEndreDeltakelsesValg(pamelding).map((valgType) => (
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
        pamelding={pamelding}
        forslag={forslag}
      />
    </>
  )
}
