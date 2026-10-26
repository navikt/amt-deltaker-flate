import { BodyLong, List } from '@navikt/ds-react'
import { Tiltakskode } from 'deltaker-flate-common'

export const SoftMaxVarighetBekreftelse = ({
  tiltakskode
}: {
  tiltakskode: Tiltakskode
}) => {
  if (tiltakskode === Tiltakskode.OPPFOLGING) {
    return (
      <BodyLong>
        Sluttdatoen er utenfor hovedregelen for maks varighet.<br></br>
        <br></br>
        Som hovedregel kan varigheten være maks tre år for brukere med nedsatt
        arbeidsevne. Hvis tiltaket brukes ved overgang fra skole eller soning i
        institusjon kan varigheten forlenges med ytterligere seks måneder.{' '}
        <br></br>
        <br></br>
        Brukes tiltaket ved overgang fra skole eller soning i institusjon?
      </BodyLong>
    )
  }
  if (tiltakskode === Tiltakskode.ARBEIDSFORBEREDENDE_TRENING) {
    return (
      <BodyLong>
        Sluttdatoen er utenfor hovedregelen for maks varighet. <br></br>
        <br></br>
        Som hovedregel kan varigheten være maks to år. Hvis deltakeren
        gjennomfører opplæring med sikte på formell kompetanse, kan varigheten
        forlenges med ytterligere ett år.<br></br>
        <br></br>
        Gjennomfører personen opplæring med sikte på formell kompetanse?
      </BodyLong>
    )
  }
  if (
    tiltakskode === Tiltakskode.ARBEIDSRETTET_REHABILITERING ||
    tiltakskode === Tiltakskode.AVKLARING ||
    tiltakskode === Tiltakskode.DIGITALT_OPPFOLGINGSTILTAK
  ) {
    return (
      <BodyLong size="small">
        Ny sluttdato er utenfor hovedregelen for maks varighet. Denne godkjennes
        kun dersom minst ett av følgende krav er oppfylt:
        <br></br>
        <List as="ul" size="small">
          <List.Item>
            Deltakeren har rett på lovbestemt ferie, og skal stå innmeldt på
            tiltaket i ferieperioden.
          </List.Item>
          <List.Item>
            Arrangøren har stengt, og deltakeren skal stå innmeldt på tiltaket i
            stengeperioden.
          </List.Item>
        </List>
      </BodyLong>
    )
  }
  return null
}
