import { BodyLong } from '@navikt/ds-react'
import { IkkeAktuellForslag } from '../../model/forslag.ts'
import { getForslagEndringAarsakText } from '../../utils/displayText.ts'
interface Props {
  ikkeAktuellForslag: IkkeAktuellForslag
}

export const IkkeAktuellForslagDetaljer = ({ ikkeAktuellForslag }: Props) => {
  return (
    <div>
      <BodyLong size="small">
        Årsak: {getForslagEndringAarsakText(ikkeAktuellForslag.aarsak)}
      </BodyLong>
    </div>
  )
}
