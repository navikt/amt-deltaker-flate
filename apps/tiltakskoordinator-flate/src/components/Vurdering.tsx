import { Vurderingstype } from '../api/data/deltakerliste.ts'
import { BodyShort } from '@navikt/ds-react'
import { XMarkOctagonIcon, CheckmarkCircleIcon } from '@navikt/aksel-icons'

interface Props {
  vurdering: Vurderingstype | null
}

export const Vurdering = ({ vurdering }: Props) => {
  if (!vurdering) return null
  return vurdering === Vurderingstype.OPPFYLLER_KRAVENE ? (
    <BodyShort size="small">
      <CheckmarkCircleIcon
        color={ikonFarge(vurdering)}
        fontSize="1.5rem"
        className="inline pb-0.5"
      />
      {vurderingDisplayTekst(vurdering)}
    </BodyShort>
  ) : (
    <BodyShort size="small">
      <XMarkOctagonIcon
        color={ikonFarge(vurdering)}
        fontSize="1.5rem"
        className="inline pb-0.5"
      />
      {vurderingDisplayTekst(vurdering)}
    </BodyShort>
  )
}

function ikonFarge(vurdering: Vurderingstype | null) {
  switch (vurdering) {
    case Vurderingstype.OPPFYLLER_KRAVENE:
      return 'var(--a-surface-success)'
    case Vurderingstype.OPPFYLLER_IKKE_KRAVENE:
      return 'var(--a-nav-red)'
    default:
      return ''
  }
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
