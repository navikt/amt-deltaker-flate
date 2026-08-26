import { EndreDeltakelsesmengdeEnkeltplassModal } from './EndreDeltakelsesmengdeEnkeltplassModal.tsx'
import { EndreDeltakelsesmengdeGruppeModal } from './EndreDeltakelsesmengdeGruppeModal.tsx'
import { EndreDeltakelsesmengdeModalProps } from './utils.ts'

export const EndreDeltakelsesmengdeModal = ({
  deltaker,
  open,
  forslag,
  onClose,
  onSuccess
}: EndreDeltakelsesmengdeModalProps) => {
  if (deltaker.deltakerliste.erEnkeltplass) {
    return (
      <EndreDeltakelsesmengdeEnkeltplassModal
        deltaker={deltaker}
        open={open}
        forslag={forslag}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    )
  }

  return (
    <EndreDeltakelsesmengdeGruppeModal
      deltaker={deltaker}
      open={open}
      forslag={forslag}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  )
}
