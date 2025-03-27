import { Tag, Tooltip } from '@navikt/ds-react'
import { InnsatsbehovType } from '../api/data/deltaker'
import { Beskyttelsesmarkering } from '../api/data/deltakerliste'
import {
  getBeskyttelsesMarkeringTekst,
  getInsatsGruppeGammelTekst,
  getInsatsGruppeTekst
} from '../utils/text_mapper'

interface Props {
  beskyttelsesmarkering: Beskyttelsesmarkering[]
  innsatsgruppe: InnsatsbehovType | null
}

export const DeltakerMarkering = ({
  beskyttelsesmarkering,
  innsatsgruppe
}: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-4">
      {beskyttelsesmarkering.map((markering) => (
        <Tag key={markering} variant="warning" size="small">
          {getBeskyttelsesMarkeringTekst(markering)}
        </Tag>
      ))}
      {innsatsgruppe && (
        <Tooltip content={getInsatsGruppeGammelTekst(innsatsgruppe)}>
          <Tag variant="warning" size="small">
            {getInsatsGruppeTekst(innsatsgruppe)}
          </Tag>
        </Tooltip>
      )}
    </div>
  )
}
