import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { DeferredFetchState, useDeferredFetch } from '../../../hooks/useDeferredFetch.ts'
import { endreDeltakelseForleng } from '../../../api/api.ts'
import { useState } from 'react'
import { BodyShort, Detail, Modal } from '@navikt/ds-react'
import { getVarighet, kalkulerSluttdato, VarighetValg } from '../../../utils/varighet.ts'
import { dateStrToNullableDate, formatDate, formatDateToDateInputStr } from '../../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { ModalFooter } from '../../ModalFooter.tsx'
import { VargihetField } from '../VargihetField.tsx'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'

interface ForlengDeltakelseModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const ForlengDeltakelseModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: ForlengDeltakelseModalProps) => {
  const [valgtVarighet, setValgtVarighet] = useState<VarighetValg | null>(null)
  const [nySluttDato, settNySluttDato] = useState<Date | null>()
  const [errorVarighet, setErrorVarighet] = useState<string | null>(null)
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)

  const sluttdato = dateStrToNullableDate(pamelding.sluttdato)
  const { enhetId } = useAppContext()

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseForleng
  } = useDeferredFetch(endreDeltakelseForleng)

  const sendEndring = () => {
    if (!valgtVarighet) {
      setErrorVarighet('Du må velge varighet')
    }
    if (!nySluttDato) {
      setErrorSluttDato('Du må velge en sluttdato')
    }

    if (nySluttDato) {
      doFetchEndreDeltakelseForleng(pamelding.deltakerId, enhetId, {
        sluttdato: formatDateToDateInputStr(nySluttDato)
      }).then((data) => {
        onSuccess(data)
      })
    }
  }

  const handleChangeVarighet = (valg: VarighetValg) => {
    setValgtVarighet(valg)
    const varighet = getVarighet(valg)
    if (varighet && sluttdato) {
      settNySluttDato(kalkulerSluttdato(sluttdato, varighet))
    } else settNySluttDato(null)

    setErrorVarighet(null)
  }

  return (
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={EndreDeltakelseType.FORLENG_DELTAKELSE} />,
        heading: 'Forleng deltakelse'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <ErrorPage message={endreDeltakelseError}/>
        )}
        <Detail size="small">
          Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser også endringen.
        </Detail>

        <VargihetField
          title="Hvor lenge skal deltakelsen forlenges?"
          className="mt-4"
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          startDato={sluttdato || undefined}
          sluttdato={dateStrToNullableDate(pamelding.deltakerliste.sluttdato) || undefined}
          errorVarighet={errorVarighet}
          errorSluttDato={errorSluttDato}
          onChangeVarighet={handleChangeVarighet}
          onChangeSluttDato={(date) => {
            settNySluttDato(date)
            setErrorSluttDato(null)
          }}
        />
        {nySluttDato && <BodyShort className="mt-2" size="small">
          Ny sluttdato: {formatDate(nySluttDato)}
        </BodyShort>}
      </Modal.Body>
      <ModalFooter
        confirmButtonText="Lagre"
        onConfirm={sendEndring}
        confirmLoading={endreDeltakelseState === DeferredFetchState.LOADING}
        disabled={endreDeltakelseState === DeferredFetchState.LOADING}
      />
    </Modal>
  )
}
