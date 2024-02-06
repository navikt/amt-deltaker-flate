import { DeferredFetchState } from '../../hooks/useDeferredFetch.ts'
import { Loader } from '@navikt/ds-react'

interface Props {
  saveState: DeferredFetchState
}

export const PameldingLagringsstatus = ({saveState}: Props) => {
  if(saveState === DeferredFetchState.LOADING) {
    return <div>
      <Loader size="small" title="Saving" /> Lagrer kladd...
    </div>
  }
  if(saveState === DeferredFetchState.RESOLVED) {
    return <div>Kladd lagret</div>
  }
  if (saveState === DeferredFetchState.ERROR) {
    return <div>Kunne ikke autolagre kladd</div>
  }

  return <></>
}
