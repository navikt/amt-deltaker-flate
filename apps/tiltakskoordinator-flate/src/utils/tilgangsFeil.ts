import { NavigateFunction } from 'react-router-dom'
import { DeltakereResponse, TilgangsFeil } from '../api/api'
import {
  getDeltakerlisteStengtUrl,
  getIkkeTilgangTilDeltakerlisteUrl,
  getIngangAdGruppeUrl
} from '../navigation'

export const isTilgangsFeil = (
  obj: DeltakereResponse | null
): obj is TilgangsFeil => {
  return (
    obj === TilgangsFeil.ManglerADGruppe ||
    obj === TilgangsFeil.IkkeTilgangTilDeltakerliste ||
    obj === TilgangsFeil.DeltakerlisteStengt
  )
}

export const handterTilgangsFeil = (
  tilgangsFeil: TilgangsFeil,
  deltakerlisteId: string,
  navigate: NavigateFunction
) => {
  if (tilgangsFeil === TilgangsFeil.ManglerADGruppe) {
    navigate(getIngangAdGruppeUrl(deltakerlisteId))
  }

  if (tilgangsFeil === TilgangsFeil.DeltakerlisteStengt) {
    navigate(getDeltakerlisteStengtUrl(deltakerlisteId))
  }

  if (tilgangsFeil === TilgangsFeil.IkkeTilgangTilDeltakerliste) {
    navigate(getIkkeTilgangTilDeltakerlisteUrl(deltakerlisteId))
  }
}
