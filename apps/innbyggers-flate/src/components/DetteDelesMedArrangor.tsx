import { BodyLong, Heading, Link, List } from '@navikt/ds-react'
import { PERSONOPPLYSNINGER_URL } from 'deltaker-flate-common'

interface Props {
  kanDeleDeltakerMedArrangor: boolean
  arrangorNavn: string
  skalViseAdresse: boolean
  visInnholdOgBakgrunnsinfo: boolean
}

export const DetteDelesMedArrangor = ({
  kanDeleDeltakerMedArrangor,
  arrangorNavn,
  skalViseAdresse,
  visInnholdOgBakgrunnsinfo
}: Props) => {
  return (
    <>
      <Heading level="3" size="medium" className="mt-6">
        Dette deles med arrangøren
      </Heading>
      {kanDeleDeltakerMedArrangor ? (
        <>
          <BodyLong size="small" className="mt-2">
            Nav samarbeider med {arrangorNavn}. Du vil få beskjed dersom det
            oversendes informasjon om deg til arrangør.
          </BodyLong>
        </>
      ) : (
        <BodyLong size="small" className="mt-2">
          Nav samarbeider med {arrangorNavn}.
        </BodyLong>
      )}

      <BodyLong size="small" className="mt-2">
        Dette deles:
      </BodyLong>

      <List as="ul" size="small" className="-mt-1 -mb-2">
        <List.Item className="mt-2 whitespace-pre-wrap">
          Navn og fødselsnummer
        </List.Item>
        <List.Item className="mt-2 whitespace-pre-wrap">
          Telefonnummer og e-postadresse
        </List.Item>
        {skalViseAdresse && (
          <List.Item className="mt-2 whitespace-pre-wrap">Adresse</List.Item>
        )}
        {visInnholdOgBakgrunnsinfo && (
          <List.Item>
            Innholdet og bakgrunnsinformasjonen i påmeldingen
          </List.Item>
        )}
        <List.Item className="mt-2 whitespace-pre-wrap">
          Navn og kontaktinformasjonen til Nav-veilederen din
        </List.Item>
      </List>
      <Link href={PERSONOPPLYSNINGER_URL} className="text-base mt-4">
        Se her hvilke opplysninger Nav har om deg.
      </Link>
    </>
  )
}
