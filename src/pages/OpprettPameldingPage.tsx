import { PameldingResponse } from '../api/data/pamelding.ts'
import { useDeferredFetch } from '../hooks/useDeferredFetch.ts'
import { deletePamelding } from '../api/api.ts'
import { TrashIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { useAppRedirection } from '../hooks/useAppRedirection.ts'
import { TILBAKE_PAGE } from '../Routes.tsx'

import { PameldingHeader } from '../components/pamelding/PameldingHeader.tsx'
import { PameldingForm } from '../components/pamelding/PameldingForm.tsx'
import { AvbrytKladdModal } from '../components/opprett-pamelding/AvbrytKladdModal.tsx'

export interface OpprettPameldingPageProps {
  pamelding: PameldingResponse
}

export const OpprettPameldingPage = ({ pamelding }: OpprettPameldingPageProps) => {
  const { doRedirect } = useAppRedirection()

  const [avbrytModalOpen, setAvbrytModalOpen] = useState<boolean>(false)

  const returnToFrontpage = () => {
    doRedirect(TILBAKE_PAGE)
  }

  const { doFetch: fetchAvbrytUtkast } = useDeferredFetch(deletePamelding, returnToFrontpage)

  return (
    <div className="m-4">
      <PameldingHeader
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
      />

      <PameldingForm pamelding={pamelding} />

      <Button
        size="small"
        variant="tertiary"
        className="mt-2"
        onClick={() => setAvbrytModalOpen(true)}
        icon={<TrashIcon />}
      >
        Avbryt
      </Button>

      <AvbrytKladdModal
        open={avbrytModalOpen}
        onConfirm={() => {
          fetchAvbrytUtkast(pamelding.deltakerId)
          setAvbrytModalOpen(false)
        }}
        onCancel={() => {
          setAvbrytModalOpen(false)
        }}
      />
    </div>
  )
}
