import { BodyShort, Label } from '@navikt/ds-react'
import { DeltakerDetaljer as DeltakerDetaljerDomene } from '../api/data/deltaker'
import { DeltakerStatusTag, EMDASH, formatDate } from 'deltaker-flate-common'
import { Vurdering } from './Vurdering'

interface Props {
  deltaker: DeltakerDetaljerDomene | null
}

export const DeltakerDetaljer = ({ deltaker }: Props) => {
  if (!deltaker) {
    return null
  }

  return (
    <div className="flex flex-col pt-6 pb-6 h-fit gap-4 w-full mr-4 border-b border-[var(--a-border-divider)]">
      <Detail title="Status">
        <DeltakerStatusTag statusType={deltaker.status.type} />
      </Detail>
      <Detail title="Vurdering, arrangør">
        {deltaker.vurdering ? (
          <div className="flex flex-col gap-2">
            <Vurdering vurdering={deltaker.vurdering.type} />
            {deltaker.vurdering.begrunnelse && (
              <BodyShort size="small">
                {deltaker.vurdering.begrunnelse}
              </BodyShort>
            )}
          </div>
        ) : (
          <BodyShort size="small">{EMDASH}</BodyShort>
        )}
      </Detail>
      <Detail title="Dato">
        <BodyShort size="small">
          {deltaker.startdato
            ? `${formatDate(deltaker.startdato)} — ${deltaker.sluttdato ? formatDate(deltaker.sluttdato) : ''}`
            : EMDASH}
        </BodyShort>
      </Detail>
    </div>
  )
}

interface DetailProps {
  title: string
  children: React.ReactNode
}

const Detail = ({ title, children }: DetailProps) => {
  return (
    <div className="flex gap-2">
      <Label size="small">{title}:</Label>
      {children}
    </div>
  )
}
