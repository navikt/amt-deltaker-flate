import { Detail, Modal, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import { PameldingResponse } from '../../../api/data/pamelding.ts'
import { useState } from 'react'
import {
  DeferredFetchState,
  useDeferredFetch
} from '../../../hooks/useDeferredFetch.ts'
import { endreDeltakelseIkkeAktuell } from '../../../api/api.ts'
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
import { DeltakerStatusAarsakType } from 'deltaker-flate-model'

interface IkkeAktuellModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const IkkeAktuellModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: IkkeAktuellModalProps) => {
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
    doFetch: doFetchEndreDeltakelseIkkeAktuell
  } = useDeferredFetch(endreDeltakelseIkkeAktuell)

  const sendEndring = () => {
    if (valgtArsak) {
      if (
        !aarsakErAnnet ||
        (aarsakErAnnet && harAnnetBeskrivelse && !harForLangAnnetBeskrivelse)
      ) {
        doFetchEndreDeltakelseIkkeAktuell(pamelding.deltakerId, enhetId, {
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
        icon: <EndringTypeIkon type={EndreDeltakelseType.IKKE_AKTUELL} />,
        heading: 'Er ikke aktuell'
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
        <RadioGroup
          className="mt-6"
          legend="Hva er årsaken til at deltakeren ikke er aktuell?"
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
