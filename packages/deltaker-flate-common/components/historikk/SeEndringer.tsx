import { Button } from '@navikt/ds-react'
import { HistorikkModal } from './HistorikkModal'
import { DeltakerHistorikkListe } from '../../model/deltakerHistorikk'
import { useState } from 'react'

interface Props {
  deltakerId: string
  className?: string
  fetchHistorikk: (deltakerId: string) => Promise<DeltakerHistorikkListe>
}

export const SeEndringer = ({
  deltakerId,
  className,
  fetchHistorikk
}: Props) => {
  const [historikkModalOpen, setHistorikkModalOpen] = useState(false)

  return (
    <>
      <Button
        className={className ?? ''}
        variant="secondary"
        size="small"
        onClick={() => setHistorikkModalOpen(true)}
      >
        Se endringer
      </Button>

      <HistorikkModal
        deltakerId={deltakerId}
        open={historikkModalOpen}
        onClose={() => setHistorikkModalOpen(false)}
        fetchHistorikk={fetchHistorikk}
      />
    </>
  )
}
