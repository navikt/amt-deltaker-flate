import { BodyLong, Heading, List, VStack } from '@navikt/ds-react'
import {
  EMDASH,
  INNHOLD_TYPE_ANNET,
  Tiltakstype,
  deltakerprosentText
} from 'deltaker-flate-common'
import { Deltakelsesinnhold } from '../../api/data/pamelding.ts'

interface Props {
  innhold: Deltakelsesinnhold | null
  bakgrunnsinformasjon: string | null
  deltakelsesprosent: number | null
  dagerPerUke: number | null
  tiltakstype: Tiltakstype
}

export const Utkast = ({
  innhold,
  bakgrunnsinformasjon,
  deltakelsesprosent,
  dagerPerUke,
  tiltakstype
}: Props) => {
  const bakgrunnsinfoVisningstekst =
    bakgrunnsinformasjon && bakgrunnsinformasjon.length > 0
      ? bakgrunnsinformasjon
      : EMDASH

  return (
    <VStack>
      <Heading level="3" size="small">
        Hva er innholdet?
      </Heading>
      <BodyLong className="mt-2" size="small">
        {innhold?.ledetekst ?? ''}
      </BodyLong>
      {innhold?.innhold && (
        <List
          as="ul"
          size="small"
          className="mt-2 mb-0 [&_ul]:m-0 [&_li:not(:last-child)]:mb-2 [&_li:last-child]:m-0"
        >
          {innhold.innhold
            .filter((i) => i.valgt)
            .map((i) => (
              <List.Item key={i.innholdskode} className="whitespace-pre-wrap">
                {`${i.tekst}${i.innholdskode === INNHOLD_TYPE_ANNET ? ': ' + i.beskrivelse : ''}`}
              </List.Item>
            ))}
        </List>
      )}
      <div className="mt-8">
        <Heading level="3" size="small">
          Bakgrunnsinfo
        </Heading>
        <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
          {bakgrunnsinfoVisningstekst}
        </BodyLong>
      </div>

      {(tiltakstype === Tiltakstype.ARBFORB ||
        tiltakstype === Tiltakstype.VASV) && (
        <>
          <Heading level="3" size="small" className="mt-8">
            Deltakelsesmengde
          </Heading>
          <BodyLong size="small" className="mt-2">
            {deltakerprosentText(deltakelsesprosent, dagerPerUke)}
          </BodyLong>
        </>
      )}
    </VStack>
  )
}
