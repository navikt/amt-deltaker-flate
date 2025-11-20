import { BodyLong, Heading } from '@navikt/ds-react'
import {
  DeltakerStatusType,
  Oppstartstype,
  Tiltakskode
} from '../model/deltaker'
import {
  erKursTiltak,
  formatDate,
  kanDeleDeltakerMedArrangor
} from '../utils/utils'

interface Props {
  tiltakskode: Tiltakskode
  arrangorNavn: string
  deltakerlisteNavn: string
  statusType: DeltakerStatusType
  oppstartstype: Oppstartstype | null
  startdato: Date | null
  sluttdato: Date | null
  size?: 'medium' | 'small'
  visDelMedArrangorInfo?: boolean
  visForUtkast?: boolean
  className?: string
}

export const OmKurset = ({
  tiltakskode,
  arrangorNavn,
  deltakerlisteNavn,
  statusType,
  oppstartstype,
  startdato,
  sluttdato,
  size,
  visDelMedArrangorInfo,
  visForUtkast,
  className
}: Props) => {
  if (!erKursTiltak(tiltakskode) || !oppstartstype) {
    return null
  }

  if (
    oppstartstype === Oppstartstype.LOPENDE &&
    tiltakskode === Tiltakskode.JOBBKLUBB
  ) {
    return null // Jobbsøkerkurs har innhold ledetekst.
  }

  const statuserForVisKurs = [
    DeltakerStatusType.KLADD,
    DeltakerStatusType.UTKAST_TIL_PAMELDING,
    DeltakerStatusType.SOKT_INN,
    DeltakerStatusType.VURDERES,
    DeltakerStatusType.VENTELISTE
  ]

  const skalViseOmKurset =
    statusType === DeltakerStatusType.KLADD ||
    (statusType === DeltakerStatusType.UTKAST_TIL_PAMELDING && visForUtkast) ||
    (statuserForVisKurs.includes(statusType) &&
      oppstartstype === Oppstartstype.FELLES)

  if (!skalViseOmKurset) {
    return null
  }

  return (
    <section className={className ?? ''}>
      <Heading size={size ?? 'medium'} level="3">
        Om kurset
      </Heading>

      {oppstartstype === Oppstartstype.LOPENDE ? (
        <BodyLong size="small">
          Når arrangøren har en ledig plass, vil de ta kontakt med deg for å
          avtale oppstart.
        </BodyLong>
      ) : (
        <>
          <BodyLong size="small">{`Kursets oppstartsdato: ${formatDate(startdato)}`}</BodyLong>
          <BodyLong size="small">
            {`Sluttdato: ${formatDate(sluttdato)}`}
          </BodyLong>

          {statusType === DeltakerStatusType.VENTELISTE ? (
            <>
              <BodyLong size="small" className="mt-4">
                Dersom det åpner seg ledig plass, vil {arrangorNavn} ta kontakt
                med deg for å avtale oppstart.
              </BodyLong>

              <BodyLong size="small" className="mt-4">
                Ordinær oppstart er {formatDate(startdato)}, men ledige plasser
                kan dukke opp etter dette. Ved ledig plass ber vi om at du er
                tilgjengelig på kort varsel.
              </BodyLong>

              <BodyLong size="small" className="mt-4">
                Skulle du ikke få plass, vil søknaden om {deltakerlisteNavn} hos{' '}
                {arrangorNavn} avslås.
              </BodyLong>
            </>
          ) : (
            <>
              <BodyLong size="small" className="mt-4">
                Når det nærmer seg oppstart av kurset, vil Nav gjøre en
                vurdering av om du oppfyller kravene for å delta. Du får svar på
                søknaden etter dette.
              </BodyLong>

              <BodyLong size="small" className="mt-4">
                Hvis du oppfyller kravene, vil du bli tildelt en plass eller
                satt på venteliste. Dersom kravene til kurset ikke er oppfylt,
                vil du få avslag på søknaden.
              </BodyLong>
            </>
          )}

          {kanDeleDeltakerMedArrangor(tiltakskode, oppstartstype) &&
            visDelMedArrangorInfo && (
              <>
                <BodyLong size="small" className="mt-4">
                  For å avgjøre hvem som skal få plass, kan Nav be om hjelp til
                  vurdering fra arrangøren av kurset. Arrangør eller koordinator
                  hos Nav vil kontakte deg hvis det er behov for et møte.
                </BodyLong>
                <BodyLong size="small" className="mt-4">
                  Du vil få beskjed dersom det oversendes informasjon til
                  arrangør.
                </BodyLong>
              </>
            )}
        </>
      )}
    </section>
  )
}
