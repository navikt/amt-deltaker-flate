import { Loader, Modal, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import {
  DeferredFetchState,
  useDeferredFetch
} from '../../hooks/useDeferredFetch'
import {
  DeltakerEndring,
  DeltakerHistorikk,
  HistorikkType,
  Vedtak
} from '../../model/deltakerHistorikk'
import { HistorikkVedtak } from './HistorikkVedtak'

interface Props {
  deltakerId: string
  open: boolean
  onClose: () => void
  fetchHistorikk: (deltakerId: string) => Promise<DeltakerHistorikk>
}

const getHistorikkItem = (historikk: Vedtak | DeltakerEndring) => {
  switch (historikk.type) {
    case HistorikkType.DeltakerEndring:
      return <div></div>
    case HistorikkType.Vedtak:
      return <HistorikkVedtak endringsVedtak={historikk} />
    default:
      return <div></div>
  }
}

export const HistorikkModal = ({
  deltakerId,
  open,
  onClose,
  fetchHistorikk
}: Props) => {
  /* const [deltakerHistorikk, setDeltakerHistorikk] =
    useState<DeltakerHistorikk | null>(null)
*/
  const {
    data: historikk,
    state,
    error,
    doFetch: doFetchHistorikk
  } = useDeferredFetch(fetchHistorikk)

  useEffect(() => {
    if (open && !historikk) {
      doFetchHistorikk(deltakerId)
      //.then((data) => setDeltakerHistorikk(data))
    }
  }, [open])

  return (
    <Modal open={open} header={{ heading: 'Endringer' }} onClose={onClose}>
      <Modal.Body>
        {state === DeferredFetchState.LOADING && (
          <VStack>
            <Loader size="3xlarge" title="Venter..." />
          </VStack>
        )}
        {error && 'error'}
        {historikk &&
          historikk.map((i, index) => (
            <div key={`${i.type}${index}`}>{getHistorikkItem(i)}</div>
          ))}
      </Modal.Body>
    </Modal>
  )
}
