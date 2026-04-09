import { PencilIcon, XMarkIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import { useState } from 'react'
import { erEnkeltPlass } from '../../utils/pamelding-ekeltplass.ts'
import { HorisontalLine } from '../HorisontalLine.tsx'
import { PameldingEnkeltplassForm } from '../pamelding/enkeltplass/PameldingEnkeltplassForm.tsx'
import { MeldPaDirekteButton } from '../pamelding/handlinger/meld-pa-direkte/MeldPaDirekteButton.tsx'
import { usePameldingFormContext } from '../pamelding/PameldingFormContext.tsx'
import { PameldingForm } from '../pamelding/standard/PameldingForm.tsx'
import { useDeltakerContext } from '../tiltak/DeltakerContext.tsx'
import { AvbrytUtkastDeltMedBrukerModal } from './AvbrytUtkastDeltMedBrukerModal.tsx'
import { UtkastDeltaker } from './UtkastDeltaker.tsx'

export const Utkast = () => {
  const { deltaker } = useDeltakerContext()
  const { disabled, redigerUtkast, setRedigerUtkast } =
    usePameldingFormContext()

  const [avbrytModalOpen, setAvbrytModalOpen] = useState<boolean>(false)

  const kanEndreUtkast = ![
    Tiltakskode.DIGITALT_OPPFOLGINGSTILTAK,
    Tiltakskode.JOBBKLUBB
  ].includes(deltaker.deltakerliste.tiltakskode)

  if (redigerUtkast) {
    return erEnkeltPlass(deltaker) ? (
      <PameldingEnkeltplassForm focusOnOpen />
    ) : (
      <PameldingForm focusOnOpen />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <UtkastDeltaker />

      <HorisontalLine />

      {deltaker.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING && (
        <div className="flex gap-4">
          <MeldPaDirekteButton
            name="Meld på uten godkjent utkast"
            variant="primary"
          />

          {kanEndreUtkast && (
            <Button
              size="small"
              variant="secondary"
              icon={<PencilIcon aria-hidden />}
              disabled={disabled}
              onClick={() => setRedigerUtkast(true)}
            >
              Endre utkast
            </Button>
          )}

          <Button
            size="small"
            variant="tertiary"
            disabled={disabled}
            onClick={() => {
              setAvbrytModalOpen(true)
            }}
            icon={<XMarkIcon aria-hidden />}
          >
            Avbryt utkast
          </Button>
        </div>
      )}

      <AvbrytUtkastDeltMedBrukerModal
        open={avbrytModalOpen}
        onClose={() => {
          setAvbrytModalOpen(false)
        }}
      />
    </div>
  )
}
