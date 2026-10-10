import { BodyShort, Heading, List } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { Deltakelsesmengde, Tiltakskode } from '../model/deltaker'
import { formatDate } from '../utils/utils'
import { getDeltakelsesmengdeText } from './DeltakelsesmengdeVisning'

type DeltakelsesmengdeForVisning = Omit<
  Deltakelsesmengde,
  'deltakelsesprosent'
> & {
  deltakelsesprosent: number | null
}

export function lagUtkastDeltakelsesmengderForVisning(
  startdato: Date | string | null,
  deltakelsesprosent: number | null,
  dagerPerUke: number | null
): DeltakelsesmengdeForVisning[] {
  if (!startdato || (deltakelsesprosent === null && dagerPerUke === null)) {
    return []
  }

  return [
    {
      gyldigFra: dayjs(startdato).toDate(),
      deltakelsesprosent,
      dagerPerUke
    }
  ]
}

interface Props {
  tiltakskode: Tiltakskode
  erEnkeltplass: boolean
  deltakelsesmengder: DeltakelsesmengdeForVisning[]
  headingLevel?: '2' | '3'
  headingSize?: 'medium' | 'small'
  headingClassName?: string
}

export function DeltakelsesmengdeInfo({
  tiltakskode,
  erEnkeltplass,
  deltakelsesmengder,
  headingLevel = '2',
  headingSize = 'medium',
  headingClassName = 'mt-8'
}: Props) {
  const perioder = [...deltakelsesmengder]
    .sort((a, b) => a.gyldigFra.getTime() - b.gyldigFra.getTime())
    .flatMap((deltakelsesmengde) => {
      const tekst = getDeltakelsesmengdeText({
        tiltakskode,
        deltakelsesprosent: deltakelsesmengde.deltakelsesprosent,
        dagerPerUke: deltakelsesmengde.dagerPerUke,
        erEnkeltplass
      })

      return tekst ? [{ deltakelsesmengde, tekst }] : []
    })

  if (perioder.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <Heading
        level={headingLevel}
        size={headingSize}
        className={headingClassName}
      >
        Deltakelsesmengde
      </Heading>
      <List as="ul" size="small">
        {perioder.map(({ deltakelsesmengde, tekst }) => (
          <List.Item key={deltakelsesmengde.gyldigFra.toISOString()}>
            <BodyShort as="span" size="small">
              {`${formatDate(deltakelsesmengde.gyldigFra)}: ${tekst}`}
            </BodyShort>
          </List.Item>
        ))}
      </List>
    </div>
  )
}
