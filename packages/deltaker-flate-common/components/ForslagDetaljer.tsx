import { AktivtForslag, ForslagEndringType } from '../model/forslag.ts'
import { ForlengDeltakelseForslagDetaljer } from './ForlengDeltakelseForslagDetaljer.tsx'
import { util } from 'zod'
import assertNever = util.assertNever

interface Props {
  forslag: AktivtForslag
}

export const ForslagDetaljer = ({ forslag }: Props) => {
  switch (forslag.endring.type) {
    case ForslagEndringType.ForlengDeltakelse:
      return (
        <ForlengDeltakelseForslagDetaljer
          forslag={forslag}
          forlengDeltakelseForslag={forslag.endring}
        />
      )
    default:
      assertNever(forslag.endring.type)
  }
}
