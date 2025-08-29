import {
  BodyLong,
  Box,
  Button,
  Detail,
  Heading,
  ReadMore
} from '@navikt/ds-react'
import {
  AktivtForslagBox,
  EndringerBox,
  EndringerWrapper,
  EndringTypeIkon,
  formatDate,
  Forslag,
  ForslagtypeDetaljer,
  getDeltakerStatusAarsakText,
  getForslagTittel
} from 'deltaker-flate-common'
import { ReactNode, useState } from 'react'
import { markerSomLest } from '../../api/api'
import type {
  UlestHendelse,
  UlestHendelseEndring
} from '../../api/data/ulestHendelse'
import { UlestHendelseType } from '../../api/data/ulestHendelse'

interface Props {
  forslag: Forslag[]
  ulesteHendelser: UlestHendelse[]
  children?: ReactNode
}
export function DeltakerEndringer({
  forslag,
  ulesteHendelser: initialUlesteHendelser,
  children
}: Props) {
  const [ulesteHendelser, setUlesteHendelser] = useState(initialUlesteHendelser)

  return (
    <EndringerWrapper className="mt-4 flex flex-col gap-4">
      {forslag.length > 0 && (
        <div>
          <Heading level="2" size="small" className="mb-2">
            Arrangør foreslår en endring:
          </Heading>
          {forslag.map((f) => {
            return <AktivtForslagBox forslag={f} key={f.id} />
          })}
        </div>
      )}

      {ulesteHendelser.length > 0 && (
        <div>
          <Heading level="2" size="small" className="mb-2">
            Oppdateringer fra nav:
          </Heading>
          <div className="flex flex-col gap-4">
            {ulesteHendelser.map((ulestHendelse) => (
              <UlestHendelseBox
                key={ulestHendelse.id}
                ulestHendelse={ulestHendelse}
                onMarkerSomLestUtfort={() => {
                  setUlesteHendelser((prev) =>
                    prev.filter((h) => h.id !== ulestHendelse.id)
                  )
                }}
              />
            ))}
          </div>
        </div>
      )}

      {children}
    </EndringerWrapper>
  )
}

const UlestHendelseBox = ({
  ulestHendelse,
  onMarkerSomLestUtfort
}: {
  ulestHendelse: UlestHendelse
  onMarkerSomLestUtfort: (id: string) => void
}) => {
  const doMarkerSomLest = (): Promise<void> => {
    return markerSomLest(ulestHendelse.id).then(() => {
      onMarkerSomLestUtfort(ulestHendelse.id)
    })
  }

  const forslag =
    'endringFraForslag' in ulestHendelse.hendelse &&
    ulestHendelse.hendelse.endringFraForslag ? (
      <ReadMore size="small" header="Forslaget fra arrangør">
        <BodyLong size="small" weight="semibold">
          {getForslagTittel(ulestHendelse.hendelse.endringFraForslag.type)}
        </BodyLong>
        <ForslagtypeDetaljer
          begrunnelse={
            'begrunnelseFraArrangor' in ulestHendelse.hendelse
              ? ulestHendelse.hendelse.begrunnelseFraArrangor
              : undefined
          }
          forslagEndring={ulestHendelse.hendelse.endringFraForslag}
        />
      </ReadMore>
    ) : (
      <></>
    )

  return (
    <EndringerBox>
      <div className="flex gap-2 p-4 items-start">
        <EndringTypeIkon type={ulestHendelse.hendelse.type} size="large" />

        <div className="flex flex-col items-start">
          <Heading level="3" size="small">
            {getUlestHendelseTittel(ulestHendelse)}
          </Heading>
          {hendelsesDetaljer(ulestHendelse.hendelse)}
          <Detail textColor="subtle">{getEndretTekst(ulestHendelse)}</Detail>
          {forslag}
        </div>
      </div>
      <Box
        background="surface-action-subtle"
        className="p-2 flex flex-col items-end"
        borderRadius="0 0 medium medium"
      >
        <Button size="small" onClick={doMarkerSomLest}>
          Marker som lest
        </Button>
      </Box>
    </EndringerBox>
  )
}

const hendelsesDetaljer = (hendelse: UlestHendelseEndring) => {
  switch (hendelse.type) {
    case UlestHendelseType.InnbyggerGodkjennUtkast:
    case UlestHendelseType.NavGodkjennUtkast:
    case UlestHendelseType.FjernOppstartsdato:
    case UlestHendelseType.ReaktiverDeltakelse:
      return null

    case UlestHendelseType.AvsluttDeltakelse:
    case UlestHendelseType.AvbrytDeltakelse:
    case UlestHendelseType.IkkeAktuell:
      return (
        <>
          {hendelse.aarsak && (
            <BodyLong size="small">
              Årsak: {getDeltakerStatusAarsakText(hendelse.aarsak)}
            </BodyLong>
          )}
          {hendelse.begrunnelseFraNav && (
            <BodyLong size="small" className="whitespace-pre-wrap">
              Navs begrunnelse: {hendelse.begrunnelseFraNav}
            </BodyLong>
          )}
        </>
      )

    case UlestHendelseType.LeggTilOppstartsdato:
    case UlestHendelseType.EndreStartdato:
      return (
        <>
          {hendelse.sluttdato && (
            <BodyLong size="small">
              Forventet sluttdato: {formatDate(hendelse.sluttdato)}
            </BodyLong>
          )}
          {hendelse.type === UlestHendelseType.EndreStartdato &&
            hendelse.begrunnelseFraNav && (
              <BodyLong size="small" className="whitespace-pre-wrap">
                Navs begrunnelse: {hendelse.begrunnelseFraNav}
              </BodyLong>
            )}
        </>
      )
  }
}

const getEndretTekst = (ulestHendelse: UlestHendelse) => {
  const endretTekst =
    ulestHendelse.hendelse.type === UlestHendelseType.InnbyggerGodkjennUtkast ||
    ulestHendelse.hendelse.type === UlestHendelseType.NavGodkjennUtkast
      ? 'Søkt inn'
      : 'Endret'

  const endretAv =
    ulestHendelse.ansvarlig.endretAvNavn &&
    ulestHendelse.ansvarlig.endretAvEnhet
      ? ` av ${ulestHendelse.ansvarlig.endretAvNavn} ${ulestHendelse.ansvarlig.endretAvEnhet}`
      : ulestHendelse.ansvarlig.endretAvNavn
        ? ` av ${ulestHendelse.ansvarlig.endretAvNavn}`
        : ''
  return `${endretTekst} ${formatDate(ulestHendelse.opprettet)}${endretAv}.`
}

const getUlestHendelseTittel = (ulestHendelse: UlestHendelse) => {
  switch (ulestHendelse.hendelse.type) {
    case UlestHendelseType.InnbyggerGodkjennUtkast:
    case UlestHendelseType.NavGodkjennUtkast:
      return 'Søkt inn'
    case UlestHendelseType.LeggTilOppstartsdato:
    case UlestHendelseType.EndreStartdato:
      return `Oppstartsdato er endret til ${formatDate(ulestHendelse.hendelse.startdato)}`
    case UlestHendelseType.FjernOppstartsdato:
      return 'Oppstartsdato er fjernet'
    case UlestHendelseType.IkkeAktuell:
      return 'Deltakelsen er ikke aktuell'
    case UlestHendelseType.AvsluttDeltakelse:
    case UlestHendelseType.AvbrytDeltakelse:
      return `Ny sluttdato er ${formatDate(ulestHendelse.hendelse.sluttdato)}`
    case UlestHendelseType.ReaktiverDeltakelse:
      return 'Deltakelsen er endret til å være aktiv'
  }
}
