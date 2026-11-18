import { Oppstartstype } from 'deltaker-flate-common'

export interface ArrangorOverenhet {
  navn: string
  arrangorer: Arrangor[]
}

export interface Arrangor {
  id: string
  navn: string
  deltakerlister: Deltakerliste[]
}

export interface Deltakerliste {
  id: string
  lopenummer: string | null
  navn: string
  tiltaksnavn: string
  startDato: Date | null
  sluttDato: Date | null
  oppstartstype: Oppstartstype | null
}
