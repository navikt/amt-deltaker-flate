import { Detail, Modal, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import {
  DeltakerStatusAarsakType,
  PameldingResponse
} from '../../../api/data/pamelding.ts'
import { useState } from 'react'
import {
  DeferredFetchState,
  useDeferredFetch
} from '../../../hooks/useDeferredFetch.ts'
import { endreDeltakelseSluttarsak } from '../../../api/api.ts'
import { useAppContext } from '../../../AppContext.tsx'
import { getDeltakerStatusAarsakTypeText } from '../../../utils/displayText.ts'
import { getDeltakerStatusAarsakTyperAsList } from '../../../utils/utils.ts'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import {
  BESKRIVELSE_ARSAK_ANNET_MAX_TEGN,
  EndreDeltakelseType
} from '../../../api/data/endre-deltakelse-request.ts'
import { ModalFooter } from '../../ModalFooter.tsx'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'

interface EndreSluttarsakModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreSluttarsakModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreSluttarsakModalProps) => {
  const [valgtArsak, setValgtArsak] = useState<DeltakerStatusAarsakType | null>(
    null
  )
  const [beskrivelse, setBeskrivelse] = useState<string | null>(null)
  const [hasError, setHasError] = useState<boolean>(false)

  const aarsakErAnnet = valgtArsak === DeltakerStatusAarsakType.ANNET
  const harAnnetBeskrivelse = beskrivelse && beskrivelse.length > 0
  const harForLangAnnetBeskrivelse =
    harAnnetBeskrivelse && beskrivelse.length > BESKRIVELSE_ARSAK_ANNET_MAX_TEGN
  const { enhetId } = useAppContext()

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreSluttarsak
  } = useDeferredFetch(endreDeltakelseSluttarsak)

  const sendEndring = () => {
    if (valgtArsak) {
      if (
        !aarsakErAnnet ||
        (aarsakErAnnet && harAnnetBeskrivelse && !harForLangAnnetBeskrivelse)
      ) {
        doFetchEndreSluttarsak(pamelding.deltakerId, enhetId, {
          aarsak: {
            type: valgtArsak,
            beskrivelse: beskrivelse
          }
        }).then((data) => {
          onSuccess(data)
        })
      } else setHasError(true)
    } else setHasError(true)
  }

  return (
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={EndreDeltakelseType.ENDRE_SLUTTARSAK} />,
        heading: 'Endre sluttårsak'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <ErrorPage message={endreDeltakelseError} />
        )}
        <Detail size="small" className="mb-4">
          Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser også
          endringen.
        </Detail>
        <RadioGroup
          legend="Hva er årsaken til avslutning?"
          size="small"
          error={
            hasError &&
            !aarsakErAnnet &&
            'Du må velge en årsak før du kan fortsette.'
          }
          onChange={(value: DeltakerStatusAarsakType) => {
            setValgtArsak(value)
            setHasError(false)
          }}
          value={valgtArsak}
        >
          <>
            {getDeltakerStatusAarsakTyperAsList().map((arsakType) => (
              <Radio value={arsakType} key={arsakType}>
                {getDeltakerStatusAarsakTypeText(arsakType)}
              </Radio>
            ))}
            {valgtArsak === DeltakerStatusAarsakType.ANNET && (
              <Textarea
                onChange={(e) => {
                  setBeskrivelse(e.target.value)
                  setHasError(false)
                }}
                value={beskrivelse ?? ''}
                minRows={1}
                rows={1}
                size="small"
                label={null}
                error={
                  (hasError &&
                    aarsakErAnnet &&
                    !harForLangAnnetBeskrivelse &&
                    'Du må fylle ut for årsak "annet" før du kan fortsette.') ||
                  (harForLangAnnetBeskrivelse &&
                    `Beskrivelsen kan ikke være mer enn ${BESKRIVELSE_ARSAK_ANNET_MAX_TEGN} tegn`)
                }
                maxLength={BESKRIVELSE_ARSAK_ANNET_MAX_TEGN}
                aria-label={'Beskrivelse for Annet'}
              />
            )}
          </>
        </RadioGroup>
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
