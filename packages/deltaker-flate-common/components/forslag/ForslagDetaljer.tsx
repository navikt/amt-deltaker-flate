import { AktivtForslag, ForslagEndringType } from '../../model/forslag.ts'
import { ForlengDeltakelseForslagDetaljer } from './ForlengDeltakelseForslagDetaljer.tsx'
import { util } from 'zod'
import assertNever = util.assertNever
import { AvsluttDeltakelseForslagDetaljer } from './AvsluttDeltakelseForslagDetaljer.tsx'

interface Props {
  forslag: AktivtForslag
}

export const ForslagDetaljer = ({ forslag }: Props) => {
  switch (forslag.endring.type) {
    case ForslagEndringType.AvsluttDeltakelse:
      return (
        <AvsluttDeltakelseForslagDetaljer
          forslag={forslag}
          avsluttDeltakelseForslag={forslag.endring}
        />
      )
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
