import { PencilIcon, XMarkIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { DeltakerStatusType, Tiltakskode } from 'deltaker-flate-common'
import { useState } from 'react'
import { erEnkeltPlassUtenRammeavtale } from '../../utils/pamelding-form-utils.ts'
import { MeldPaDirekteButton } from '../pamelding/handlinger/meld-pa-direkte/MeldPaDirekteButton.tsx'
import { PameldingEnkeltplassForm } from '../pamelding/enkeltplass/PameldingEnkeltplassForm.tsx'
import { usePameldingFormContext } from '../pamelding/PameldingFormContext.tsx'
import { HorisontalLine } from '../HorisontalLine.tsx'
import { PameldingForm } from '../pamelding/standard/PameldingForm.tsx'
import { usePameldingContext } from '../tiltak/PameldingContext.tsx'
import { AvbrytUtkastDeltMedBrukerModal } from './AvbrytUtkastDeltMedBrukerModal.tsx'
import { UtkastDeltaker } from './UtkastDeltaker.tsx'

export const Utkast = () => {
  const { pamelding } = usePameldingContext()
  const { disabled, redigerUtkast, setRedigerUtkast } =
    usePameldingFormContext()

  const [avbrytModalOpen, setAvbrytModalOpen] = useState<boolean>(false)

  const kanEndreUtkast = ![
    Tiltakskode.DIGITALT_OPPFOLGINGSTILTAK,
    Tiltakskode.JOBBKLUBB
  ].includes(pamelding.deltakerliste.tiltakskode)

  if (redigerUtkast) {
    return erEnkeltPlassUtenRammeavtale(pamelding) ? (
      <PameldingEnkeltplassForm focusOnOpen />
    ) : (
      <PameldingForm focusOnOpen />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <UtkastDeltaker />

      <HorisontalLine className="mt-8 mb-8" />

      {pamelding.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING && (
        <>
          <MeldPaDirekteButton name="Meld på uten godkjent utkast" />

          {kanEndreUtkast && (
            <Button
              size="small"
              variant="secondary"
              icon={<PencilIcon aria-hidden />}
              disabled={disabled}
              onClick={() => setRedigerUtkast(true)}
              className="mt-8"
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
        </>
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
