import { BodyLong, ExpansionCard, Link, List } from '@navikt/ds-react'
import { PERSONOPPLYSNINGER_URL } from '../utils/constants'

interface Props {
  adresseDelesMedArrangor: boolean
  arrangorNavn: string
  className?: string
}

export const HvaDelesMedArrangor = ({
  adresseDelesMedArrangor,
  arrangorNavn,
  className
}: Props) => {
  return (
    <ExpansionCard
      aria-label="Dette deles med arrangøren"
      className={className || ''}
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title>Dette deles med arrangøren</ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <BodyLong size="small">
          Nav samarbeider med {arrangorNavn}. Arrangøren behandler opplysninger
          på vegne av Nav.
        </BodyLong>
        <List as="ul" size="small">
          <List.Item>
            Navn og kontaktinformasjonen til Nav-veilederen din
          </List.Item>
          <List.Item>
            Innholdet og bakgrunnsinformasjonen i påmeldingen
          </List.Item>
          <List.Item>Navn og fødselsnummer</List.Item>
          <List.Item>Telefonnummer og e-postadresse</List.Item>
          {adresseDelesMedArrangor && <List.Item>Adresse</List.Item>}
        </List>
        <Link href={PERSONOPPLYSNINGER_URL} className="text-base">
          Se her hvilke opplysninger Nav har om deg.
        </Link>
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
