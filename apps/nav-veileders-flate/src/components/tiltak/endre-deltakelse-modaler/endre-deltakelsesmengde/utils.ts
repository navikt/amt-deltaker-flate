import dayjs from 'dayjs'
import {
  DeltakelsesmengdeForslag,
  Forslag,
  ForslagEndring,
  ForslagEndringType
} from 'deltaker-flate-common'
import { DeltakerResponse } from '../../../../api/data/deltaker.ts'
import { formatDateToDtoStr } from '../../../../utils/utils.ts'

export interface EndreDeltakelsesmengdeModalProps {
  deltaker: DeltakerResponse
  open: boolean
  forslag: Forslag | null
  onClose: () => void
  onSuccess: (oppdatertDeltaker: DeltakerResponse | null) => void
}

function isDeltakelsesmengde(
  endring: ForslagEndring
): endring is DeltakelsesmengdeForslag {
  return endring.type === ForslagEndringType.Deltakelsesmengde
}

export function getMengde(deltaker: DeltakerResponse, forslag: Forslag | null) {
  const defaultGyldigFra = dayjs().isAfter(deltaker.sluttdato)
    ? dayjs(deltaker.sluttdato).toDate()
    : deltaker.startdato && dayjs().isBefore(deltaker.startdato)
      ? dayjs(deltaker.startdato).toDate()
      : dayjs().toDate()
  if (forslag === null)
    return {
      deltakelsesprosent: deltaker.deltakelsesprosent ?? 100,
      dagerPerUke: deltaker.dagerPerUke,
      gyldigFra: defaultGyldigFra
    }
  if (isDeltakelsesmengde(forslag.endring)) {
    return {
      deltakelsesprosent: forslag.endring.deltakelsesprosent,
      dagerPerUke: forslag.endring.dagerPerUke,
      gyldigFra: forslag.endring.gyldigFra ?? defaultGyldigFra
    }
  } else {
    throw new Error(
      `Kan ikke behandle forslag av type ${forslag.endring.type} som deltakelsesmengde`
    )
  }
}

type SisteDeltakelsesmengde = NonNullable<
  DeltakerResponse['deltakelsesmengder']['sisteDeltakelsesmengde']
>

export function harEndringSidenSisteDeltakelsesmengde(
  deltaker: DeltakerResponse,
  gyldigFra: Date,
  erMengdeEndret: (siste: SisteDeltakelsesmengde) => boolean
) {
  const siste = deltaker.deltakelsesmengder.sisteDeltakelsesmengde
  if (siste === null) {
    return true
  }

  if (erMengdeEndret(siste)) {
    return true
  }

  return dayjs(gyldigFra)
    .startOf('day')
    .isBefore(dayjs(siste.gyldigFra).startOf('day'))
}

export function lagFellesDeltakelsesmengdeBodyFelter(
  gyldigFra: Date,
  begrunnelse: string | null | undefined,
  forslagId: string | null | undefined
) {
  return {
    gyldigFra: formatDateToDtoStr(gyldigFra),
    begrunnelse: begrunnelse ?? null,
    forslagId: forslagId ?? null
  }
}
