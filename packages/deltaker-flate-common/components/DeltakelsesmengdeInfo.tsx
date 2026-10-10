import { BodyShort, Heading } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { Deltakelsesmengde, Tiltakskode } from '../model/deltaker'
import { formatDate } from '../utils/utils'
import { getDeltakelsesmengdeText } from './DeltakelsesmengdeVisning'

interface Props {
  tiltakskode: Tiltakskode
  deltakelsesprosent: number | null
  dagerPerUke: number | null
  erEnkeltplass: boolean
  gyldigeDeltakelsesmengder: Deltakelsesmengde[]
  sluttdato: Date | string | null
  nesteDeltakelsesmengde: Deltakelsesmengde | null
}

export function DeltakelsesmengdeInfo({
  tiltakskode,
  deltakelsesprosent,
  dagerPerUke,
  erEnkeltplass,
  gyldigeDeltakelsesmengder,
  sluttdato,
  nesteDeltakelsesmengde
}: Props) {
  const deltakelsesmengdeText = getDeltakelsesmengdeText({
    tiltakskode,
    deltakelsesprosent,
    dagerPerUke,
    erEnkeltplass
  })

  const nesteDeltakelsesmengdeText = nesteDeltakelsesmengde
    ? getDeltakelsesmengdeText({
        tiltakskode,
        deltakelsesprosent: nesteDeltakelsesmengde.deltakelsesprosent,
        dagerPerUke: nesteDeltakelsesmengde.dagerPerUke,
        erEnkeltplass
      })
    : null

  if (deltakelsesmengdeText === null) {
    return null
  }

  const perioder = gyldigeDeltakelsesmengder
    .map((deltakelsesmengde, index) => {
      const nestePeriode = gyldigeDeltakelsesmengder[index + 1]
      const sluttdatoPeriode = nestePeriode
        ? dayjs(nestePeriode.gyldigFra).subtract(1, 'day').toDate()
        : sluttdato
          ? dayjs(sluttdato).toDate()
          : null
      const tekst = getDeltakelsesmengdeText({
        tiltakskode,
        deltakelsesprosent: deltakelsesmengde.deltakelsesprosent,
        dagerPerUke: deltakelsesmengde.dagerPerUke,
        erEnkeltplass
      })
      const periodeTekst = `Periode (fom. ${formatDate(
        deltakelsesmengde.gyldigFra
      )}${sluttdatoPeriode ? ` t.o.m. ${formatDate(sluttdatoPeriode)}` : ''}):`

      return tekst ? { deltakelsesmengde, periodeTekst, tekst } : null
    })
    .filter((periode) => periode !== null)

  if (perioder.length > 0) {
    return (
      <>
        <Heading level="2" size="medium" className="mt-8">
          Deltakelsesmengde
        </Heading>
        {perioder.map(({ deltakelsesmengde, periodeTekst, tekst }) => (
          <div key={deltakelsesmengde.gyldigFra.toISOString()}>
            <BodyShort size="small" className="mt-2">
              {periodeTekst}
            </BodyShort>
            <BodyShort size="small">{tekst}</BodyShort>
          </div>
        ))}
      </>
    )
  }

  if (!nesteDeltakelsesmengde && !deltakelsesmengdeText) {
    return null
  }
  return (
    <>
      <Heading level="2" size="medium" className="mt-8">
        Deltakelsesmengde
      </Heading>
      {nesteDeltakelsesmengde ? (
        <>
          <BodyShort size="small" className="mt-2">
            Nåværende periode:
          </BodyShort>
          <BodyShort size="small">
            {deltakelsesmengdeText || '(ikke satt)'}
          </BodyShort>
          <BodyShort size="small" className="mt-2">
            Neste periode (fom. {formatDate(nesteDeltakelsesmengde.gyldigFra)}
            ):
          </BodyShort>
          <BodyShort size="small">{nesteDeltakelsesmengdeText}</BodyShort>
        </>
      ) : (
        <BodyShort size="small" className="mt-2">
          {deltakelsesmengdeText}
        </BodyShort>
      )}
    </>
  )
}
