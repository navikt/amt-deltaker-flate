import { ForslagEndringType } from 'deltaker-flate-common'
import {
  Adressetype,
  Hendelser,
  TiltakDeltakerStatus
} from '../api/data/deltaker'
import {
  DeltakerStatusAarsak,
  DeltakerStatusAarsakType
} from '../api/data/deltakerStatusArsak'
import { Veiledertype } from '../api/data/veileder'

export const mapTiltakDeltakerStatusTilTekst = (
  tiltakDeltakerStatus: TiltakDeltakerStatus | string
): string => {
  switch (tiltakDeltakerStatus) {
    case TiltakDeltakerStatus.VENTER_PA_OPPSTART:
      return 'Venter på oppstart'
    case TiltakDeltakerStatus.DELTAR:
      return 'Deltar'
    case TiltakDeltakerStatus.HAR_SLUTTET:
      return 'Har sluttet'
    case TiltakDeltakerStatus.IKKE_AKTUELL:
      return 'Ikke aktuell'
    case TiltakDeltakerStatus.SOKT_INN:
      return 'Søkt inn'
    case TiltakDeltakerStatus.VURDERES:
      return 'Vurderes'
    case TiltakDeltakerStatus.FULLFORT:
      return 'Fullført'
    case TiltakDeltakerStatus.AVBRUTT:
      return 'Avbrutt'
    default:
      return tiltakDeltakerStatus.toString()
  }
}

export const mapHendelseTypeTilTekst = (
  hendelse: Hendelser | string
): string => {
  if (hendelse === Hendelser.SvarFraNav) {
    return 'Svar fra Nav'
  } else if (hendelse === Hendelser.VenterPaSvarFraNav) {
    return 'Venter på svar fra Nav'
  } else if (hendelse === Hendelser.OppdateringFraNav) {
    return 'Oppdatering fra Nav'
  } else if (hendelse === Hendelser.NyDeltaker) {
    return 'Nye deltakere'
  } else {
    return ''
  }
}

export const mapVeilderTypeTilTekst = (
  veilederType: Veiledertype | string
): string => {
  if (veilederType === Veiledertype.MEDVEILEDER) {
    return 'Medveileder'
  } else {
    return 'Veileder'
  }
}

export const mapAdresseTypeTilTekst = (adressetype: Adressetype) => {
  switch (adressetype) {
    case Adressetype.KONTAKTADRESSE:
      return 'Kontaktadresse'
    case Adressetype.OPPHOLDSADRESSE:
      return 'Oppholdsadresse'
    case Adressetype.BOSTEDSADRESSE:
      return 'Bostedsadresse'
  }
}

export const getDeltakerStatusAarsakText = (aarsak: DeltakerStatusAarsak) => {
  switch (aarsak.type) {
    case DeltakerStatusAarsakType.ANNET: {
      const beskrivelse = aarsak.beskrivelse ? ` - ${aarsak.beskrivelse}` : ''
      return `Annet${beskrivelse}`
    }
    case DeltakerStatusAarsakType.FATT_JOBB:
      return 'Fått jobb'
    case DeltakerStatusAarsakType.IKKE_MOTT:
      return 'Møter ikke opp'
    case DeltakerStatusAarsakType.SYK:
      return 'Syk'
    case DeltakerStatusAarsakType.TRENGER_ANNEN_STOTTE:
      return 'Trenger annen hjelp og støtte'
    case DeltakerStatusAarsakType.UTDANNING:
      return 'Utdanning'
    case DeltakerStatusAarsakType.SAMARBEIDET_MED_ARRANGOREN_ER_AVBRUTT:
      return 'Samarbeidet med arrangøren er avbrutt'
    case DeltakerStatusAarsakType.KURS_FULLT:
      return 'Kurset er fullt'
    case DeltakerStatusAarsakType.KRAV_IKKE_OPPFYLT:
      return 'Krav for deltakelse er ikke oppfylt'
    case DeltakerStatusAarsakType.FIKK_IKKE_PLASS:
      return 'Fikk ikke plass'
    case DeltakerStatusAarsakType.AVLYST_KONTRAKT:
      return 'Kontrakten med arrangør er avlyst'
    default:
      return `Ukjent årsak ${aarsak.type}`
  }
}

export const getForslagTittel = (endringstype: ForslagEndringType) => {
  switch (endringstype) {
    case ForslagEndringType.IkkeAktuell:
      return 'Er ikke aktuell'
    case ForslagEndringType.ForlengDeltakelse:
      return 'Forleng deltakelse'
    case ForslagEndringType.AvsluttDeltakelse:
      return 'Avslutt deltakelse'
    case ForslagEndringType.Deltakelsesmengde:
      return 'Endre deltakelsesmengde'
    case ForslagEndringType.Sluttarsak:
      return 'Endre sluttårsak'
    case ForslagEndringType.Sluttdato:
      return 'Endre sluttdato'
    case ForslagEndringType.Startdato:
      return 'Endre oppstartsdato'
    case ForslagEndringType.FjernOppstartsdato:
      return 'Fjern oppstartsdato'
    case ForslagEndringType.EndreAvslutning:
      return 'Endre avslutning'
  }
}
