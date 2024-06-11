import {
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  Tiltakstype,
  DeltakerStatusAarsak
} from '../model/deltaker'

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
  }
}
