import { Modal, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakerStatusAarsakType,
  DeltakerStatusType,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useState } from 'react'
import { useAppContext } from '../../../AppContext.tsx'
import { endreDeltakelseSluttarsak } from '../../../api/api.ts'
import {
  BESKRIVELSE_ARSAK_ANNET_MAX_TEGN,
  EndreDeltakelseType
} from '../../../api/data/endre-deltakelse-request.ts'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'
import { getDeltakerStatusAarsakTypeText } from '../../../utils/displayText.ts'
import { getDeltakerStatusAarsakTyperAsList } from '../../../utils/utils.ts'
import { ModalFooter } from '../../ModalFooter.tsx'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'

interface EndreSluttarsakModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

const sluttarsakSporsmalTekst = (statustype: DeltakerStatusType) => {
  if (statustype === DeltakerStatusType.IKKE_AKTUELL) {
    return 'Hva er årsaken til at deltakeren ikke er aktuell?'
  } else {
    return 'Hva er årsaken til avslutning?'
  }
}

export const EndreSluttarsakModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreSluttarsakModalProps) => {
  const [valgtArsak, setValgtArsak] = useState<DeltakerStatusAarsakType | null>(
    pamelding.status.aarsak?.type ?? null
  )
  const [beskrivelse, setBeskrivelse] = useState<string | null>(
    pamelding.status.aarsak?.beskrivelse ?? null
  )
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
            beskrivelse: aarsakErAnnet ? beskrivelse : null
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
      <Modal.Body className="min-w-[30rem]">
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <ErrorPage message={endreDeltakelseError} />
        )}
        <RadioGroup
          legend={sluttarsakSporsmalTekst(pamelding.status.type)}
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
