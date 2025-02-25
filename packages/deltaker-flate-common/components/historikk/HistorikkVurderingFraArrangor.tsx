import { HistorikkElement } from './HistorikkElement.tsx'
import { MenuElipsisHorizontalCircleFillIcon } from '@navikt/aksel-icons'
import { BodyShort, Detail } from '@navikt/ds-react'
import { VurderingFraArrangor } from '../../model/forslag.ts'
import { formatDateFromString } from '../../utils/utils.ts'
import { Vurderingstype } from '../../model/deltaker.ts'

interface Props {
  vurdering: VurderingFraArrangor
}
export const HistorikkVurderingFraArrangor = ({ vurdering }: Props) => {
  const vurderingstypeTekst = getVurderingstypeTekst(vurdering.vurderingstype)
  return (
    <HistorikkElement
      tittel={'Vurdering fra arrangør'}
      icon={
        <MenuElipsisHorizontalCircleFillIcon color="var(--a-deepblue-400)" />
      }
    >
      <BodyShort size="small">Vurdering: {vurderingstypeTekst}</BodyShort>
      {vurdering.begrunnelse && (
        <BodyShort size="small">Begrunnelse: {vurdering.begrunnelse}</BodyShort>
      )}
      <Detail className="mt-1" textColor="subtle">
        Endret {formatDateFromString(vurdering.opprettetDato.toString())} av{' '}
        {vurdering.endretAv}
      </Detail>
    </HistorikkElement>
  )
}

function getVurderingstypeTekst(vurderingstype: Vurderingstype) {
  if (vurderingstype == Vurderingstype.OPPFYLLER_KRAVENE)
    return 'Kravene for deltakelse er oppfylt'
  else if (vurderingstype == Vurderingstype.OPPFYLLER_IKKE_KRAVENE)
    return 'Kravene for deltakelse er ikke oppfylt'
}
