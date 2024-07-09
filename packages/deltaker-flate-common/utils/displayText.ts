import {
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  Tiltakstype,
  DeltakerStatusAarsak,
  DeltakerlisteStatus
} from '../model/deltaker'
import {
  ForslagEndringAarsak,
  ForslagEndringAarsakType,
  ForslagStatusType
} from '../model/forslag.ts'
import { EndreDeltakelseType } from '../model/endre-deltaker.ts'

export const deltakerprosentText = (
  deltakelsesprosent: number | null,
  dagerPerUke: number | null
) => {
  const dagerIUkaText = dagerPerUke
    ? `fordelt på ${dagerPerUke} ${dagerPerUke > 1 ? 'dager' : 'dag'} i uka.`
    : ''
  return `${deltakelsesprosent ?? 100}\u00A0% ${dagerIUkaText}`
}

export const getTiltakstypeDisplayText = (type: Tiltakstype): string => {
  switch (type) {
    case Tiltakstype.ARBFORB:
      return 'Arbeidsforberedende trening'
    case Tiltakstype.ARBRRHDAG:
      return 'Arbeidsrettet rehabilitering'
    case Tiltakstype.AVKLARAG:
      return 'Avklaring'
    case Tiltakstype.INDOPPFAG:
      return 'Oppfølging'
    case Tiltakstype.DIGIOPPARB:
      return 'Digitalt oppfølgingstiltak'
    case Tiltakstype.GRUFAGYRKE:
      return 'Fag- og yrkesopplæring'
    case Tiltakstype.GRUPPEAMO:
      return 'Arbeidsmarkedsopplæring'
    case Tiltakstype.JOBBK:
      return 'Jobbklubb'
    case Tiltakstype.VASV:
      return 'Varig tilrettelagt arbeid'
  }
}

export const hentTiltakNavnHosArrangorTekst = (
  tiltakstype: Tiltakstype,
  arrangorNavn: string
) => `${getTiltakstypeDisplayText(tiltakstype)} hos ${arrangorNavn}`

export const getDeltakerStatusDisplayText = (
  type: DeltakerStatusType
): string => {
  switch (type) {
    case DeltakerStatusType.KLADD:
      return 'Kladd'
    case DeltakerStatusType.UTKAST_TIL_PAMELDING:
      return 'Utkast til påmelding'
    case DeltakerStatusType.VENTER_PA_OPPSTART:
      return 'Venter på oppstart'
    case DeltakerStatusType.DELTAR:
      return 'Deltar'
    case DeltakerStatusType.HAR_SLUTTET:
      return 'Har sluttet'
    case DeltakerStatusType.IKKE_AKTUELL:
      return 'Ikke aktuell'
    case DeltakerStatusType.FEILREGISTRERT:
      return 'Feilregistrert'
    case DeltakerStatusType.SOKT_INN:
      return 'Søkt inn'
    case DeltakerStatusType.VURDERES:
      return 'Vurderes'
    case DeltakerStatusType.VENTELISTE:
      return 'Venteliste'
    case DeltakerStatusType.AVBRUTT:
      return 'Avbrutt'
    case DeltakerStatusType.FULLFORT:
      return 'Fullført'
    case DeltakerStatusType.PABEGYNT_REGISTRERING:
      return 'Påbegynt Registrering'
    case DeltakerStatusType.AVBRUTT_UTKAST:
      return 'Avbrutt utkast'
  }
}

export const getDeltakerStatusAarsakText = (aarsak: DeltakerStatusAarsak) => {
  switch (aarsak.type) {
    case DeltakerStatusAarsakType.ANNET:
      return `Annet - ${aarsak.beskrivelse}`
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
  }
}

export const getDeltakerlisteStatusText = (status: DeltakerlisteStatus) => {
  switch (status) {
    case DeltakerlisteStatus.PLANLAGT:
      return 'Planlagt'
    case DeltakerlisteStatus.GJENNOMFORES:
      return 'Gjennomføres'
    case DeltakerlisteStatus.AVSLUTTET:
      return 'Avsluttet'
    case DeltakerlisteStatus.AVLYST:
      return 'Avlyst'
    case DeltakerlisteStatus.AVBRUTT:
      return 'Avbrutt'
  }
}

export const getForslagStatusTypeText = (type: ForslagStatusType) => {
  switch (type) {
    case ForslagStatusType.VenterPaSvar:
      return 'Venter på svar fra NAV'
  }
}

export const getForslagEndringAarsakText = (aarsak: ForslagEndringAarsak) => {
  switch (aarsak.type) {
    case ForslagEndringAarsakType.Annet:
      return `Annet - ${aarsak.beskrivelse}`
    case ForslagEndringAarsakType.FattJobb:
      return 'Fått jobb'
    case ForslagEndringAarsakType.IkkeMott:
      return 'Møter ikke opp'
    case ForslagEndringAarsakType.Syk:
      return 'Syk'
    case ForslagEndringAarsakType.TrengerAnnenStotte:
      return 'Trenger annen hjelp og støtte'
    case ForslagEndringAarsakType.Utdanning:
      return 'Utdanning'
    case ForslagEndringAarsakType.FikkIkkePlass:
      return 'Fikk ikke plass'
  }
}

export const getEndreDeltakelseTypeText = (type: EndreDeltakelseType) => {
  switch (type) {
    case EndreDeltakelseType.IKKE_AKTUELL:
      return 'Ikke aktuell'
    case EndreDeltakelseType.AVSLUTT_DELTAKELSE:
      return 'Avslutt deltakelse'
    case EndreDeltakelseType.ENDRE_BAKGRUNNSINFO:
      return 'Endre bakgrunnsinfo'
    case EndreDeltakelseType.ENDRE_INNHOLD:
      return 'Endre innhold'
    case EndreDeltakelseType.ENDRE_OPPSTARTSDATO:
      return 'Endre oppstartsdato'
    case EndreDeltakelseType.ENDRE_SLUTTARSAK:
      return 'Endre sluttårsak'
    case EndreDeltakelseType.ENDRE_SLUTTDATO:
      return 'Endre sluttdato'
    case EndreDeltakelseType.FORLENG_DELTAKELSE:
      return 'Forleng deltakelse'
    case EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE:
      return 'Endre deltakelsesmengde'
    case EndreDeltakelseType.REAKTIVER_DELTAKELSE:
      return 'Endre til aktiv deltakelse'
  }
}
