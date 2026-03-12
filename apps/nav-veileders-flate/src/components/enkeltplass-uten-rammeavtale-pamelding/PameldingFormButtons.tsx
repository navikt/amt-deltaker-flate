import { DelUtkastButton } from './del-utkast/DelUtkastButton.tsx'
import { MeldPaDirekteButton } from './meld-pa-direkte/MeldPaDirekteButton.tsx'
import { SlettKladdButton } from './slett-kladd/SlettKladdButton.tsx'

interface Props {
  disabled?: boolean
  className?: string
}

export const PameldingFormButtons = ({ disabled, className }: Props) => {
  return (
    <div className={`flex gap-4 ${className ?? ''}`}>
      <DelUtkastButton disabled={disabled} />
      <MeldPaDirekteButton disabled={disabled} />
      <SlettKladdButton disabled={disabled} />
    </div>
  )
}
