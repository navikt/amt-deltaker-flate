import { BodyShort, ConfirmationPanel, Detail, Modal } from '@navikt/ds-react'
import dayjs from 'dayjs'
import {
  DeferredFetchState,
  Tiltakstype,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseForleng } from '../../../api/api.ts'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import {
  dateStrToNullableDate,
  formatDateToDateInputStr,
  formatDateToString
} from '../../../utils/utils.ts'
import {
  VarighetValg,
  getSoftMaxVarighetBekreftelseText,
  getVarighet,
  kalkulerSluttdato
} from '../../../utils/varighet.tsx'
import { ModalFooter } from '../../ModalFooter.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { VarighetField } from '../VarighetField.tsx'

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
  const [nySluttDato, settNySluttDato] = useState<Date>()
  const [sluttDatoField, setSluttDatoField] = useState<Date>()
  const [errorVarighet, setErrorVarighet] = useState<string | null>(null)
  const [errorSluttDato, setErrorSluttDato] = useState<string | null>(null)
  const [varighetBekreftelse, setVarighetConfirmation] = useState(false)
  const [errorVarighetConfirmation, setErrorVarighetConfirmation] = useState<
    string | null
  >(null)

  const sluttdatoDeltaker = dateStrToNullableDate(pamelding.sluttdato)
  const tiltakstype = pamelding.deltakerliste.tiltakstype
  const { enhetId } = useAppContext()

  const softMaxVarighetDato =
    pamelding.startdato && pamelding.softMaxVarighet
      ? dayjs(pamelding.startdato).add(pamelding.softMaxVarighet, 'millisecond')
      : null
  const maxVarighetDato =
    pamelding.startdato && pamelding.maxVarighet
      ? dayjs(pamelding.startdato).add(pamelding.maxVarighet, 'millisecond')
      : null
  const skalBekrefteVarighet =
    nySluttDato &&
    dayjs(nySluttDato).isAfter(softMaxVarighetDato) &&
    dayjs(nySluttDato).isSameOrBefore(maxVarighetDato) &&
    (tiltakstype === Tiltakstype.ARBFORB ||
      tiltakstype === Tiltakstype.INDOPPFAG)

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseForleng
  } = useDeferredFetch(endreDeltakelseForleng)

  const sendEndring = () => {
    let hasError = false
    if (!valgtVarighet) {
      setErrorVarighet('Du må velge varighet')
      hasError = true
    }
    if (!nySluttDato) {
      setErrorSluttDato('Du må velge en sluttdato')
      hasError = true
    }
    if (skalBekrefteVarighet && !varighetBekreftelse) {
      setErrorVarighetConfirmation(
        'Du må bekrefte at deltakeren oppfyller kravene.'
      )
      hasError = true
    }
    // TODO sjekke om ny sluttdato er lenger enn maxvarighetsdato

    if (!hasError && nySluttDato) {
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

    const handleErrorVarighet = (sluttdato: Date | undefined) => {
      if (maxVarighetDato && dayjs(sluttdato).isAfter(maxVarighetDato)) {
        setErrorVarighet(
          'Datoen kan ikke velges fordi den er utenfor maks varighet.'
        )
      } else {
        setErrorVarighet(null)
      }
    }

    if (valg === VarighetValg.ANNET) {
      settNySluttDato(sluttDatoField)
      handleErrorVarighet(sluttDatoField)
    } else if (varighet && sluttdatoDeltaker) {
      const nySluttDato = kalkulerSluttdato(sluttdatoDeltaker, varighet)
      settNySluttDato(nySluttDato)
      handleErrorVarighet(nySluttDato)
    } else {
      settNySluttDato(undefined)
      setErrorVarighet(null)
    }
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
          <ErrorPage message={endreDeltakelseError} />
        )}
        <Detail size="small">
          Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser også
          endringen.
        </Detail>

        <VarighetField
          title="Hvor lenge skal deltakelsen forlenges?"
          className="mt-4"
          tiltakstype={pamelding.deltakerliste.tiltakstype}
          startDato={sluttdatoDeltaker || undefined}
          sluttdato={
            dateStrToNullableDate(pamelding.deltakerliste.sluttdato) ||
            undefined
          }
          errorVarighet={errorVarighet}
          errorSluttDato={errorSluttDato}
          onChangeVarighet={handleChangeVarighet}
          onChangeSluttDato={(date) => {
            settNySluttDato(date)
            setSluttDatoField(date)
            setErrorSluttDato(null)
          }}
        />
        {nySluttDato && (
          <BodyShort className="mt-2" size="small">
            Ny sluttdato: {formatDateToString(nySluttDato)}
          </BodyShort>
        )}
        {skalBekrefteVarighet && (
          <ConfirmationPanel
            className="mt-6"
            checked={varighetBekreftelse}
            label="Ja, deltakeren oppfyller kravene."
            onChange={() => {
              setVarighetConfirmation((x) => !x)
              setErrorVarighetConfirmation(null)
            }}
            size="small"
            error={errorVarighetConfirmation}
          >
            {getSoftMaxVarighetBekreftelseText(tiltakstype)}
          </ConfirmationPanel>
        )}
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
