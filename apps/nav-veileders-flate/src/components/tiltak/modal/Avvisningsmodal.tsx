import {
  Forslag,
  DeferredFetchState,
  useDeferredFetch
} from 'deltaker-flate-common'
import { PameldingResponse } from '../../../api/data/pamelding'
import { ReactNode } from 'react'
import { Detail, Modal } from '@navikt/ds-react'
import { ErrorPage } from '../../../pages/ErrorPage'
import { ModalForslagDetaljer } from '../forslag/ModalForslagDetaljer'
import { avvisForslag } from '../../../api/api'
import { ModalFooter } from '../../ModalFooter'
import { BegrunnelseInput, useBegrunnelse } from './BegrunnelseInput'
import { useAppContext } from '../../../AppContext'

interface Props {
  onSend: (oppdatertPamelding: PameldingResponse | null) => void
  forslag: Forslag
  children?: ReactNode
}

export default function AvvisningsmodalBody({
  onSend,
  forslag,
  children
}: Props) {
  const { doFetch, state, error } = useDeferredFetch(avvisForslag)
  const { enhetId } = useAppContext()
  const begrunnelse = useBegrunnelse(false)

  const avvis = () => {
    if (begrunnelse.valider()) {
      doFetch(forslag.id, enhetId, {
        begrunnelse: begrunnelse.begrunnelse
      }).then(onSend)
    }
  }

  return (
    <>
      <Modal.Body>
        {state === DeferredFetchState.ERROR && <ErrorPage message={error} />}
        <Detail className="mb-4">
          Infoen vil vises for bruker og arrangør.
        </Detail>
        <ModalForslagDetaljer forslag={forslag} />

        <BegrunnelseInput
          type="avvis"
          onChange={begrunnelse.handleChange}
          error={begrunnelse.error}
        />
        {children}
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Avvis forslag"
        onConfirm={avvis}
        confirmLoading={state === DeferredFetchState.LOADING}
        disabled={state === DeferredFetchState.LOADING}
      />
    </>
  )
}
