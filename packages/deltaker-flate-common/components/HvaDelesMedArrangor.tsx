import { BodyLong, ExpansionCard, Link, List } from '@navikt/ds-react'
import {
  DeltakerStatusType,
  Oppstartstype,
  Pameldingstype,
  Tiltakskode
} from '../model/deltaker'
import { PERSONOPPLYSNINGER_URL } from '../utils/constants'
import {
  harAdresse,
  harBakgrunnsinfo,
  harInnhold,
  kanDeleDeltakerMedArrangorForVurdering
} from '../utils/utils'

interface Props {
  adresseDelesMedArrangor: boolean
  statusType: DeltakerStatusType
  arrangorNavn: string
  tiltakskode: Tiltakskode
  oppstartstype: Oppstartstype | null
  pameldingstype: Pameldingstype
  erEnkeltplassUtenRammeavtale: boolean
  className?: string
}

export const HvaDelesMedArrangor = ({
  adresseDelesMedArrangor,
  statusType,
  arrangorNavn,
  tiltakskode,
  oppstartstype,
  pameldingstype,
  erEnkeltplassUtenRammeavtale,
  className
}: Props) => {
  if (!oppstartstype || erEnkeltplassUtenRammeavtale) {
    return null
  }

  const visInnholdOgBakgrunnsinfo =
    harBakgrunnsinfo(tiltakskode) || harInnhold(tiltakskode)

  const visDelMedArrangorInfo =
    kanDeleDeltakerMedArrangorForVurdering(pameldingstype, tiltakskode) &&
    (statusType === DeltakerStatusType.SOKT_INN ||
      statusType === DeltakerStatusType.VURDERES)

  return (
    <ExpansionCard
      aria-label="Dette deles med arrangøren"
      className={className || ''}
      size="small"
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title as="h2">
          Dette deles med arrangøren
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        {visDelMedArrangorInfo ? (
          <>
            <BodyLong size="small">
              For å avgjøre hvem som skal få plass, kan Nav be om hjelp til
              vurdering fra arrangøren av kurset. Arrangør eller Nav vil
              kontakte deg hvis det er behov for et møte.
            </BodyLong>
            <BodyLong size="small" className="mt-4">
              Du vil få beskjed dersom det oversendes informasjon om deg til
              arrangør.
            </BodyLong>
          </>
        ) : (
          <BodyLong size="small">Nav samarbeider med {arrangorNavn}.</BodyLong>
        )}

        <BodyLong size="small" className="mt-2">
          Dette deles:
        </BodyLong>

        <List as="ul" size="small">
          <List.Item>Navn og fødselsnummer</List.Item>
          <List.Item>Telefonnummer og e-postadresse</List.Item>

          {adresseDelesMedArrangor && harAdresse(tiltakskode) && (
            <List.Item>Adresse</List.Item>
          )}

          {visInnholdOgBakgrunnsinfo && (
            <List.Item>
              Innholdet og bakgrunnsinformasjonen i påmeldingen
            </List.Item>
          )}

          <List.Item>
            Navn og kontaktinformasjonen til Nav-veilederen din
          </List.Item>
        </List>

        <Link href={PERSONOPPLYSNINGER_URL} className="text-base">
          Se her hvilke opplysninger Nav har om deg.
        </Link>
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
