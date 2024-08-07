import { BodyLong, Heading, ReadMore } from '@navikt/ds-react'
import { Forslag, ForslagEndringType } from '../../model/forslag'
import { getForslagEndringAarsakText } from '../../utils/displayText'
import { getForslagStatusTag } from '../../utils/forslagUtils'

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
        <>
          <BodyLong size="small" weight="semibold">
            Er ikke aktuell
          </BodyLong>
          <BodyLong size="small">
            {getForslagEndringAarsakText(forslag.endring.aarsak)}
          </BodyLong>
        </>
      )
    }
    case ForslagEndringType.ForlengDeltakelse: {
      return <div></div>
    }
    case ForslagEndringType.AvsluttDeltakelse: {
      return <div></div>
    }
    case ForslagEndringType.Deltakelsesmengde: {
      return <div></div>
    }
    case ForslagEndringType.Sluttarsak: {
      return <div></div>
    }
    case ForslagEndringType.Sluttdato: {
      return <div></div>
    }
    case ForslagEndringType.Startdato: {
      return <div></div>
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
      </div>

      {forslag && (
        <ReadMore
          size="small"
          header="Forslaget fra arrangør"
          className="mt-1mb-1"
        >
          {getForslagsDetaljer(forslag)}
        </ReadMore>
      )}
    </div>
  )
}
