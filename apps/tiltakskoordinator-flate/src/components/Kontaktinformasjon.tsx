import { BodyLong, Heading } from '@navikt/ds-react'
import { DeltakerDetaljer } from '../api/data/deltaker'
import {
  Buildings3Icon,
  EnvelopeClosedIcon,
  HouseIcon,
  PersonIcon,
  PhoneIcon
} from '@navikt/aksel-icons'
import { erAdresseBeskyttet, formaterTelefonnummer } from '../utils/utils'
import { EMDASH } from 'deltaker-flate-common'

interface Props {
  deltaker: DeltakerDetaljer | null
}

export const Kontaktinformasjon = ({ deltaker }: Props) => {
  if (!deltaker) {
    return null
  }

  const adresseBeskyttet = erAdresseBeskyttet(deltaker.beskyttelsesmarkering)

  return (
    <div className="w-fit">
      {!adresseBeskyttet && (
        <Box>
          <Heading level="3" size="xsmall">
            Kontaktinformasjon
          </Heading>
          <Item
            icon={PhoneIcon}
            title="Telefonnummer"
            detail={formaterTelefonnummer(
              deltaker.kontaktinformasjon.telefonnummer
            )}
          />
          <Item
            icon={EnvelopeClosedIcon}
            title="Epost"
            detail={deltaker.kontaktinformasjon.epost}
          />
          <Item
            icon={HouseIcon}
            title="Adresse"
            detail={deltaker.kontaktinformasjon.adresse}
          />
        </Box>
      )}

      <Box>
        <Heading level="3" size="xsmall">
          Nav-kontor
        </Heading>
        <Item
          icon={Buildings3Icon}
          title="Nav-enhet"
          detail={deltaker.navEnhet}
        />

        <Heading level="3" size="xsmall">
          Nav-veileder
        </Heading>
        <Item
          icon={PersonIcon}
          title="Nav-veileder navn"
          detail={deltaker.navVeileder?.navn}
        />
        <Item
          icon={PhoneIcon}
          title="Nav-veileder telefonnummer"
          detail={formaterTelefonnummer(deltaker.navVeileder?.telefonnummer)}
        />
        <Item
          icon={EnvelopeClosedIcon}
          title="Nav-veileder epost"
          detail={deltaker.navVeileder?.epost}
        />
      </Box>
    </div>
  )
}

interface BoxProps {
  children: React.ReactNode
}

const Box = ({ children }: BoxProps) => {
  return (
    <div className="mb-4 p-4 flex flex-col gap-4 border border-[var(--a-border-default)]">
      {children}
    </div>
  )
}

interface ItemProps {
  icon: React.ElementType
  title: string
  detail: string | null | undefined
}

const Item = ({ icon: IconComponent, title, detail }: ItemProps) => {
  return (
    <div className="flex gap-2 items-center">
      <IconComponent title={title} fontSize="1.25rem" />
      <BodyLong size="medium">{detail ?? EMDASH}</BodyLong>
    </div>
  )
}
