import { Tiltakskode } from '../model/deltaker'

const tiltakskodeVisningsnavn: Partial<Record<Tiltakskode, string>> = {
  [Tiltakskode.ARBEIDSFORBEREDENDE_TRENING]: 'Arbeidsforberedende trening',
  [Tiltakskode.ARBEIDSRETTET_REHABILITERING]: 'Arbeidsrettet rehabilitering',
  [Tiltakskode.AVKLARING]: 'Avklaring',
  [Tiltakskode.DIGITALT_OPPFOLGINGSTILTAK]: 'Digitalt jobbsøkerkurs',
  [Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING]: 'Arbeidsmarkedsopplæring',
  [Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING]: 'Fag- og yrkesopplæring',
  [Tiltakskode.JOBBKLUBB]: 'Jobbsøkerkurs',
  [Tiltakskode.OPPFOLGING]: 'Oppfølging',
  [Tiltakskode.VARIG_TILRETTELAGT_ARBEID_SKJERMET]: 'Varig tilrettelagt arbeid',
  [Tiltakskode.TILRETTELAGT_ARBEID_ORDINAER]:
    'Tilrettelagt arbeid i ordinær virksomhet',
  [Tiltakskode.ENKELTPLASS_ARBEIDSMARKEDSOPPLAERING]:
    'Arbeidsmarkedsopplæring (enkeltplass)',
  [Tiltakskode.ENKELTPLASS_FAG_OG_YRKESOPPLAERING]:
    'Fag- og yrkesopplæring (enkeltplass)',
  [Tiltakskode.HOYERE_UTDANNING]: 'Høyere utdanning',
  [Tiltakskode.ARBEIDSMARKEDSOPPLAERING]: 'Arbeidsmarkedsopplæring',
  [Tiltakskode.NORSKOPPLAERING_GRUNNLEGGENDE_FERDIGHETER_FOV]:
    'Norskopplæring, grunnleggende ferdigheter og FOV',
  [Tiltakskode.STUDIESPESIALISERING]: 'Studiespesialisering',
  [Tiltakskode.FAG_OG_YRKESOPPLAERING]: 'Fag- og yrkesopplæring',
  [Tiltakskode.HOYERE_YRKESFAGLIG_UTDANNING]: 'Høyere yrkesfaglig utdanning'
}

const fallbackVisningsnavn = (tiltakskode: Tiltakskode) =>
  tiltakskode.toLowerCase().replace(/_/g, ' ')

export const mockVisningsnavn = (tiltakskode: Tiltakskode) =>
  tiltakskodeVisningsnavn[tiltakskode] ?? fallbackVisningsnavn(tiltakskode)
