import { ArenaTiltakskode, Oppstartstype } from '../model/deltaker'

export const kanRedigereTiltak = (tiltaksType: ArenaTiltakskode) =>
  [
    ArenaTiltakskode.DIGIOPPARB,
    ArenaTiltakskode.JOBBK,
    ArenaTiltakskode.GRUPPEAMO,
    ArenaTiltakskode.GRUFAGYRKE
  ].includes(tiltaksType)

export const erKursTiltak = (tiltaksType: ArenaTiltakskode) =>
  [
    ArenaTiltakskode.JOBBK,
    ArenaTiltakskode.GRUPPEAMO,
    ArenaTiltakskode.GRUFAGYRKE
  ].includes(tiltaksType)

export const harFellesOppstart = (oppstartstype: Oppstartstype) =>
  oppstartstype === Oppstartstype.FELLES
