import { BodyLong, Heading, List } from '@navikt/ds-react'
import {
  EMDASH,
  Tiltakstype,
  UtkastHeader,
  deltakerprosentText,
  hentTiltakNavnHosArrangorTekst
} from 'deltaker-flate-common'
import { useDeltakerContext } from '../DeltakerContext'

export const AvbruttUtkastPage = () => {
  const { deltaker } = useDeltakerContext()
  const tiltakOgStedTekst = hentTiltakNavnHosArrangorTekst(
    deltaker.deltakerliste.tiltakstype,
    deltaker.deltakerliste.arrangorNavn
  )

  return (
    <div className="flex flex-col items-start mb-8">
      <Heading level="1" size="xlarge" data-testid="heading_avbrutt_tiltak">
        {tiltakOgStedTekst}
      </Heading>
      <Heading level="2" size="large" className="mt-4">
        Avbrutt utkast
      </Heading>
      <UtkastHeader vedtaksinformasjon={deltaker.vedtaksinformasjon} />

      <Heading level="3" size="medium" className="mt-2">
        Dette er innholdet
      </Heading>
      {deltaker.deltakelsesinnhold?.ledetekst && (
        <BodyLong size="small" className="mt-2">
          {deltaker.deltakelsesinnhold?.ledetekst}
        </BodyLong>
      )}

      {deltaker.deltakelsesinnhold?.innhold && (
        <List as="ul" size="small" className="mt-2">
          {deltaker.deltakelsesinnhold.innhold.map((innhold) => (
            <List.Item
              key={innhold.innholdskode}
              className="mt-2 whitespace-pre-wrap"
            >
              {innhold.tekst}
              {innhold.beskrivelse ? `: ${innhold.beskrivelse}` : ''}
            </List.Item>
          ))}
        </List>
      )}

      {deltaker.bakgrunnsinformasjon && (
        <>
          <Heading level="3" size="medium" className="mt-6">
            Bakgrunnsinfo
          </Heading>
          <BodyLong size="small" className="mt-2 whitespace-pre-wrap">
            {deltaker.bakgrunnsinformasjon || EMDASH}
          </BodyLong>
        </>
      )}

      {(deltaker.deltakerliste.tiltakstype === Tiltakstype.ARBFORB ||
        deltaker.deltakerliste.tiltakstype === Tiltakstype.VASV) && (
        <>
          <Heading level="3" size="medium" className="mt-6">
            Deltakelsesmengde
          </Heading>
          <BodyLong size="small" className="mt-2">
            {deltakerprosentText(
              deltaker.deltakelsesprosent,
              deltaker.dagerPerUke
            )}
          </BodyLong>
        </>
      )}
    </div>
  )
}
