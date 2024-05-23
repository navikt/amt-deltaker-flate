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
    <VStack gap="4">
      <Heading level="2" size="medium">
        Hva er innholdet?
      </Heading>
      <BodyLong size="small">{innhold?.ledetekst ?? ''}</BodyLong>
      {innhold?.innhold && (
        <List as="ul" size="small">
          {innhold.innhold
            .filter((i) => i.valgt)
            .map((i) => (
              <List.Item key={i.innholdskode}>
                {`${i.tekst}${i.innholdskode === INNHOLD_TYPE_ANNET ? ': ' + i.beskrivelse : ''}`}
              </List.Item>
            ))}
        </List>
      )}
      <div className="mt-4">
        <Heading level="2" size="medium">
          Bakgrunnsinfo
        </Heading>
        <BodyLong size="small" className="mt-2">
          {bakgrunnsinfoVisningstekst}
        </BodyLong>
      </div>

      {(tiltakstype === Tiltakstype.ARBFORB ||
        tiltakstype === Tiltakstype.VASV) && (
        <>
          <Heading level="2" size="medium" className="mt-4">
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
