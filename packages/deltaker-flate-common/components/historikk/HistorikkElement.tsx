import { BodyLong, Detail, Heading, ReadMore } from '@navikt/ds-react'
import { Forslag } from '../../model/forslag'
import { getForslagTittel } from '../../utils/displayText'
import { getForslagStatusTag } from '../../utils/forslagUtils'
import { formatDate } from '../../utils/utils'
import { ForslagtypeDetaljer } from '../forslag/ForslagDetaljer'

interface Props {
  tittel: string
  icon: React.ReactNode
  forslag?: Forslag | null
  children: React.ReactNode
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
              <ForslagtypeDetaljer forslag={forslag} />
              <Detail
                className="mt-1"
                textColor="subtle"
              >{`Sendt ${formatDate(forslag.opprettet)} fra ${forslag.arrangorNavn}.`}</Detail>
            </ReadMore>
          </div>
        )}
      </div>
    </div>
  )
}
