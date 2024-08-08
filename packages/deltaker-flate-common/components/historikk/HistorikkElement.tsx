import { BodyLong, Detail, Heading, ReadMore } from '@navikt/ds-react'
import { Forslag, ForslagEndringType } from '../../model/forslag'
import {
  deltakerprosentText,
  getForslagEndringAarsakText,
  getForslagTittel
} from '../../utils/displayText'
import { getForslagStatusTag } from '../../utils/forslagUtils'
import { formatDate } from '../../utils/utils'

interface Props {
  tittel: string
  icon: React.ReactNode
  forslag?: Forslag | null
  children: React.ReactNode
}

const getForslagsDetaljer = (forslag: Forslag) => {
  switch (forslag.endring.type) {
    case ForslagEndringType.IkkeAktuell: {
      return (
        <BodyLong size="small">
          {`Årsak: ${getForslagEndringAarsakText(forslag.endring.aarsak)}`}
        </BodyLong>
      )
    }
    case ForslagEndringType.ForlengDeltakelse: {
      return (
        <BodyLong size="small">
          Ny sluttdato: {formatDate(forslag.endring.sluttdato)}
        </BodyLong>
      )
    }
    case ForslagEndringType.AvsluttDeltakelse: {
      return (
        <>
          <BodyLong size="small">
            Ny sluttdato: {formatDate(forslag.endring.sluttdato)}
          </BodyLong>
          <BodyLong size="small">
            {`Årsak: ${getForslagEndringAarsakText(forslag.endring.aarsak)}`}
          </BodyLong>
        </>
      )
    }
    case ForslagEndringType.Deltakelsesmengde: {
      return (
        <BodyLong size="small">
          Ny deltakelsesmengde:{' '}
          {deltakerprosentText(
            forslag.endring.deltakelsesprosent,
            forslag.endring.dagerPerUke
          )}
        </BodyLong>
      )
    }
    case ForslagEndringType.Sluttarsak: {
      return (
        <BodyLong size="small">
          Ny sluttårsak: {getForslagEndringAarsakText(forslag.endring.aarsak)}
        </BodyLong>
      )
    }
    case ForslagEndringType.Sluttdato: {
      return (
        <BodyLong size="small">
          Ny sluttdato: {formatDate(forslag.endring.sluttdato)}
        </BodyLong>
      )
    }
    case ForslagEndringType.Startdato: {
      return (
        <>
          <BodyLong size="small">
            Ny oppstartsdato: {formatDate(forslag.endring.startdato)}
          </BodyLong>
          <BodyLong size="small">
            Forventet sluttdato: {formatDate(forslag.endring.sluttdato)}
          </BodyLong>
        </>
      )
    }
  }
}

export const HistorikkElement = ({
  tittel,
  icon,
  forslag,
  children
}: Props) => {
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: '1.25rem auto'
      }}
    >
      <div className="mt-3 text-xl" aria-hidden>
        {icon}
      </div>

      <div className="pt-2">
        <div className="flex md:flex-row flex-col justify-between w-full">
          <Heading level="2" size="small" className="mb-1">
            {tittel}
          </Heading>
          {forslag && (
            <div className="w-fit md:mb-0 mb-1">
              {getForslagStatusTag(forslag.status.type)}
            </div>
          )}
        </div>

        {children}
        {forslag && (
          <div className="mt-1 mb-1">
            <ReadMore size="small" header="Forslaget fra arrangør">
              <BodyLong size="small" weight="semibold">
                {getForslagTittel(forslag.endring.type)}
              </BodyLong>
              {getForslagsDetaljer(forslag)}
              {forslag.begrunnelse && (
                <BodyLong size="small">
                  {`Begrunnelse: ${forslag.begrunnelse}`}
                </BodyLong>
              )}
              <Detail className="mt-1">{`Sendt ${formatDate(forslag.opprettet)} fra Muligheter AS.`}</Detail>
            </ReadMore>
          </div>
        )}
      </div>
    </div>
  )
}
