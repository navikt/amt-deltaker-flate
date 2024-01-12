import {DeltakerStatusType, Tiltakstype} from '../api/data/pamelding.ts'

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

export const getDeltakerStatusDisplayText = (type: DeltakerStatusType): string => {
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
  }
}
