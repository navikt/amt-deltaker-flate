import { PameldingResponse } from '../api/data/pamelding.ts'
import { PameldingHeader } from '../components/pamelding/PameldingHeader.tsx'
import { RedigerPameldingHeader } from '../components/rediger-pamelding/RedigerPameldingHeader.tsx'
import { PameldingForm } from '../components/pamelding/PameldingForm.tsx'
import { Button } from '@navikt/ds-react'
import { TrashIcon } from '@navikt/aksel-icons'
import { useState } from 'react'
import { AvbrytUtkastDeltMedBrukerModal } from '../components/rediger-pamelding/AvbrytUtkastDeltMedBrukerModal.tsx'

export interface RedigerPameldingPageProps {
  pamelding: PameldingResponse
}

export const RedigerPameldingPage = ({pamelding}: RedigerPameldingPageProps) => {

  const [avbrytModalOpen, setAvbrytModalOpen] = useState<boolean>(false)

  return (
    <div>
      <div className="space-y-4">
        <div>
          <PameldingHeader
            tiltakstype={pamelding.deltakerliste.tiltakstype}
            arrangorNavn={pamelding.deltakerliste.arrangorNavn}
          />
          <RedigerPameldingHeader
            status={pamelding.status.type}
            endretAv={pamelding.sistEndretAv}
          />
        </div>

        <PameldingForm pamelding={pamelding}/>

      </div>

      <Button
        size="small"
        variant="tertiary"
        disabled={false}
        className="mt-2"
        onClick={() => {
          setAvbrytModalOpen(true)
        }}
        icon={<TrashIcon/>}
      >
        Avbryt utkast
      </Button>

      <AvbrytUtkastDeltMedBrukerModal
        open={avbrytModalOpen}
        onConfirm={() => {
        }}
        onCancel={() => {
          setAvbrytModalOpen(false)
        }}
      />

    </div>
  )
}
