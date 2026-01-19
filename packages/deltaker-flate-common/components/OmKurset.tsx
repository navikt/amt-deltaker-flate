import { BodyLong, Heading, Label, List } from '@navikt/ds-react'
import {
  DeltakerStatusType,
  Oppstartstype,
  Pameldingstype,
  Tiltakskode
} from '../model/deltaker'
import {
  erOpplaringstiltak,
  formatDate,
  formatDateWithMonthName,
  kanDeleDeltakerMedArrangorForVurdering,
  skalMeldePaaDirekte
} from '../utils/utils'

interface Props {
  tiltakskode: Tiltakskode
  statusType: DeltakerStatusType
  oppstartstype: Oppstartstype | null
  pameldingstype: Pameldingstype
  startdato: Date | null
  sluttdato: Date | null
  size?: 'medium' | 'small'
  headingLevel?: 2 | 3 | 4
  visDelMedArrangorInfo?: boolean
  className?: string
}

export const OmKurset = ({
  tiltakskode,
  statusType,
  oppstartstype,
  pameldingstype,
  startdato,
  sluttdato,
  headingLevel,
  size,
  visDelMedArrangorInfo,
  className
}: Props) => {
  const erTiltakSomSkalViseOmKurset =
    erOpplaringstiltak(tiltakskode) || tiltakskode === Tiltakskode.JOBBKLUBB

  if (!erTiltakSomSkalViseOmKurset || !oppstartstype) {
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

  if (!statuserForVisKurs.includes(statusType)) {
    return null
  }

  const kreverGodkjenning = !skalMeldePaaDirekte(pameldingstype)

  return (
    <section className={className ?? ''}>
      <Heading size={size ?? 'medium'} level={`${headingLevel ?? 3}`}>
        Om kurset
      </Heading>

      {oppstartstype === Oppstartstype.LOPENDE && !kreverGodkjenning && (
        <BodyLong size="small" className="mt-2">
          Når det blir ledig plass, tar Nav eller arrangøren kontakt med deg for
          å avtale når du skal begynne.
        </BodyLong>
      )}

      {oppstartstype === Oppstartstype.LOPENDE && kreverGodkjenning && (
        <BodyLong size="small" className="mt-2">
          Nav vurderer søknaden din, og du får beskjed om resultatet.
        </BodyLong>
      )}

      {oppstartstype !== Oppstartstype.LOPENDE && (
        <>
          {statusType === DeltakerStatusType.VENTELISTE && (
            <>
              <BodyLong size="small" className="mt-2">
                Dersom det åpner seg ledig plass, vil Nav eller arrangøren ta
                kontakt med deg for å avtale når du skal begynne.
              </BodyLong>

              <BodyLong size="small" className="mt-4">
                Ordinær oppstart er {formatDateWithMonthName(startdato)}, men
                ledige plasser kan dukke opp etter dette. Ved ledig plass ber vi
                om at du er tilgjengelig på kort varsel. Kurset slutter{' '}
                {formatDateWithMonthName(sluttdato)}.
              </BodyLong>

              <BodyLong size="small" className="mt-4">
                Hvis du ikke får plass, vil søknaden avslås.
              </BodyLong>
            </>
          )}

          {statusType !== DeltakerStatusType.VENTELISTE && (
            <>
              <BodyLong size="small" className="mt-2">
                Nav vil vurdere søknaden din, og du får beskjed om resultatet.
              </BodyLong>

              <List as="ul" size="small" className="-mt-1">
                <List.Item className="mt-2 whitespace-pre-wrap">
                  Du kan få plass på kurset.
                </List.Item>
                <List.Item className="mt-2 whitespace-pre-wrap">
                  Du kan bli satt på venteliste.
                </List.Item>
                <List.Item className="mt-2 whitespace-pre-wrap">
                  Du kan få avslag.
                </List.Item>
              </List>

              {kanDeleDeltakerMedArrangorForVurdering(
                pameldingstype,
                tiltakskode
              ) &&
                visDelMedArrangorInfo && (
                  <>
                    <BodyLong size="small" className="mt-4">
                      For å avgjøre hvem som skal få plass, kan Nav be om hjelp
                      til vurdering fra arrangøren av kurset. Arrangør eller
                      koordinator hos Nav vil kontakte deg hvis det er behov for
                      et møte.
                    </BodyLong>
                    <BodyLong size="small" className="mt-4">
                      Du vil få beskjed dersom det oversendes informasjon til
                      arrangør.
                    </BodyLong>
                  </>
                )}

              <div className="flex mt-6">
                <Label className="mr-2">Kurset starter: </Label>
                <BodyLong size="small"> {formatDate(startdato)}</BodyLong>
              </div>
              <div className="flex mt-2">
                <Label className="mr-2">Kurset slutter: </Label>
                <BodyLong size="small"> {formatDate(sluttdato)}</BodyLong>
              </div>
            </>
          )}
        </>
      )}
    </section>
  )
}
