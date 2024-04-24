export enum Tiltakstype {
  ARBFORB = 'ARBFORB', // Arbeidsforberedende trening / AFT
  ARBRRHDAG = 'ARBRRHDAG', // Arbeidsrettet rehabilitering / ARR
  AVKLARAG = 'AVKLARAG', // Avklaring
  INDOPPFAG = 'INDOPPFAG', // Oppfølging
  DIGIOPPARB = 'DIGIOPPARB', // Digitalt oppfølgingstiltak
  GRUFAGYRKE = 'GRUFAGYRKE', // Fag og yrkesopplæring gruppe / er kurs
  GRUPPEAMO = 'GRUPPEAMO', // Arbeidsmarkedsopplæring i gruppe / er kurs
  JOBBK = 'JOBBK', // Jobbklubb / er kurs
  VASV = 'VASV' // Varig tilrettelagt arbeid (skjermet virksomhet) / VTA
}

export enum DeltakerStatusType {
  KLADD = 'KLADD',
  UTKAST_TIL_PAMELDING = 'UTKAST_TIL_PAMELDING',
  AVBRUTT_UTKAST = 'AVBRUTT_UTKAST',
  VENTER_PA_OPPSTART = 'VENTER_PA_OPPSTART',
  DELTAR = 'DELTAR',
  HAR_SLUTTET = 'HAR_SLUTTET',
  IKKE_AKTUELL = 'IKKE_AKTUELL',
  FEILREGISTRERT = 'FEILREGISTRERT',
  SOKT_INN = 'SOKT_INN',
  VURDERES = 'VURDERES',
  VENTELISTE = 'VENTELISTE',
  AVBRUTT = 'AVBRUTT',
  FULLFORT = 'FULLFORT',
  PABEGYNT_REGISTRERING = 'PABEGYNT_REGISTRERING'
}

export enum DeltakerStatusAarsakType {
  SYK = 'SYK',
  FATT_JOBB = 'FATT_JOBB',
  TRENGER_ANNEN_STOTTE = 'TRENGER_ANNEN_STOTTE',
  // UTDANNING = 'UTDANNING', TODO denne er ny og ikke støttet av backend enda
  IKKE_MOTT = 'IKKE_MOTT',
  ANNET = 'ANNET'
  // TODO Feilregistrert
}
