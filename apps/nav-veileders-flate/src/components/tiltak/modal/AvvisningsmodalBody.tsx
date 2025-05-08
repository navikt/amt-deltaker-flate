import { Alert, Detail, Link, Modal } from '@navikt/ds-react'
import {
  BegrunnelseInput,
  DeferredFetchState,
  Forslag,
  useBegrunnelse,
  useDeferredFetch
} from 'deltaker-flate-common'
import { ReactNode } from 'react'
import { avvisForslag } from '../../../api/api'
import { PameldingResponse } from '../../../api/data/pamelding'
import { useAppContext } from '../../../AppContext'
import { ErrorPage } from '../../../pages/ErrorPage'
import { ModalFooter } from '../../ModalFooter'
import { ModalForslagDetaljer } from '../forslag/ModalForslagDetaljer'

interface Props {
  onSend: (oppdatertPamelding: PameldingResponse | null) => void
  forslag: Forslag
  children?: ReactNode
}

export const RUTINE_NAVET_LINK =
  'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-tiltak-og-virkemidler/SitePages/Klage-p%C3%A5-arbeidsmarkedstiltak.aspx'

export default function AvvisningsmodalBody({
  forslag,
  onSend,
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
          disabled={false}
        />
        {children}
        <Alert variant="info" className="mt-4" size="small">
          Brukeren mottar ikke varsel når forslaget avvises. Vurder om det er
          behov for et{' '}
          <Link href={RUTINE_NAVET_LINK} inlineText target="_blank">
            avslagsbrev (åpner i en ny fane).
          </Link>
        </Alert>
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
