import { Vurderingstype } from '../api/data/deltakerliste.ts'
import { BodyShort } from '@navikt/ds-react'

interface Props {
  vurdering: Vurderingstype | null
}

export const Vurdering = ({ vurdering }: Props) => {
  return <BodyShort>{vurderingDisplayTekst(vurdering)}</BodyShort>
}

function vurderingDisplayTekst(vurdering: Vurderingstype | null) {
  switch (vurdering) {
    case Vurderingstype.OPPFYLLER_KRAVENE:
      return 'Krav oppfylt'
    case Vurderingstype.OPPFYLLER_IKKE_KRAVENE:
      return 'Krav ikke oppfylt'
    default:
      return ''
  }
}
