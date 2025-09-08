import {
  BodyLong,
  Box,
  Button,
  Detail,
  Heading,
  ReadMore
} from '@navikt/ds-react'
import {
  EndringerBox,
  EndringTypeIkon,
  ForslagtypeDetaljer,
  getDeltakerStatusAarsakText,
  getForslagTittel,
  UlestHendelseType
} from 'deltaker-flate-common'
import { markerSomLest } from '../../api/api'
import {
  UlestHendelse,
  UlestHendelseEndring
} from '../../api/data/ulestHendelse'
import {
  getEndretTekst,
  getUlestHendelseTittel
} from '../../utils/ulestHendelse'

export const UlestHendelseBox = ({
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

  return (
    <EndringerBox>
      <div className="flex gap-2 p-4 items-start">
        <EndringTypeIkon type={ulestHendelse.hendelse.type} size="large" />

        <div className="flex flex-col items-start">
          <Heading level="3" size="small">
            {getUlestHendelseTittel(ulestHendelse)}
          </Heading>
          <HendelsesDetaljer hendelse={ulestHendelse.hendelse} />
          <Detail textColor="subtle">{getEndretTekst(ulestHendelse)}</Detail>
          <ForslagFraUlestHendelse ulestHendelse={ulestHendelse} />
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

const ForslagFraUlestHendelse = ({
  ulestHendelse
}: {
  ulestHendelse: UlestHendelse
}) => {
  if (
    'endringFraForslag' in ulestHendelse.hendelse &&
    ulestHendelse.hendelse.endringFraForslag
  ) {
    return (
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
    )
  }

  return <></>
}

const HendelsesDetaljer = ({
  hendelse
}: {
  hendelse: UlestHendelseEndring
}) => {
  switch (hendelse.type) {
    case UlestHendelseType.InnbyggerGodkjennUtkast:
    case UlestHendelseType.NavGodkjennUtkast:
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
  }
}
