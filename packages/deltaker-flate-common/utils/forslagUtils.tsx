import { AktivtForslag, ForslagEndringType } from '../model/forslag.ts'
import { util } from 'zod'
import assertNever = util.assertNever
import { ForlengDeltakelseForslagDetaljer } from '../components/ForlengDeltakelseForslagDetaljer'

export const getForslagDetaljer = (forslag: AktivtForslag) => {
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
