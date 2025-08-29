import { formatDate } from 'deltaker-flate-common'
import { UlestHendelse, UlestHendelseType } from '../api/data/ulestHendelse'

export const getEndretTekst = (ulestHendelse: UlestHendelse) => {
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

export const getUlestHendelseTittel = (ulestHendelse: UlestHendelse) => {
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
