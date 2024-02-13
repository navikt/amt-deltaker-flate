import { Alert, Heading, Modal, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import { DeltakerStatusAarsakType, PameldingResponse } from '../../../api/data/pamelding'
import { useState } from 'react'
import { DeferredFetchState, useDeferredFetch } from '../../../hooks/useDeferredFetch'
import { endreDeltakelseIkkeAktuell } from '../../../api/api'
import { useAppContext } from '../../../AppContext'
import { getDeltakerStatusAarsakTypeText } from '../../../utils/displayText'
import { BESKRIVELSE_MAX_TEGN } from '../../../model/PameldingFormValues'
import { getDeltakerStatusAarsakTyperAsList } from '../../../utils/utils'
import { EndringTypeIkon } from '../EndringTypeIkon.tsx'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request.ts'
import { ModalFooter } from '../../ModalFooter.tsx'

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
  const [valgtArsak, setValgtArsak] = useState<DeltakerStatusAarsakType | null>(null)
  const [beskrivelse, setBeskrivelse] = useState<string | null>(null)
  const [hasError, setHasError] = useState<boolean>(false)

  const aarsakErAnnet = valgtArsak === DeltakerStatusAarsakType.ANNET
  const harAnnetBeskrivelse = beskrivelse && beskrivelse.length > 0
  const { enhetId } = useAppContext()

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseIkkeAktuell
  } = useDeferredFetch(endreDeltakelseIkkeAktuell)

  const sendEndring = () => {
    if (valgtArsak) {
      if (!aarsakErAnnet || (aarsakErAnnet && harAnnetBeskrivelse)) {
        doFetchEndreDeltakelseIkkeAktuell(pamelding.deltakerId, enhetId, {
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
        icon: <EndringTypeIkon type={EndreDeltakelseType.IKKE_AKTUELL} />,
        heading: 'Er ikke aktuell'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <Alert variant="error" className="mt-4 mb-4">
            <Heading size="small" spacing level="3">
              Det skjedde en feil.
            </Heading>
            {endreDeltakelseError}
          </Alert>
        )}
        <RadioGroup
          legend="Hva er årsaken til at deltakeren ikke er aktuell?"
          size="small"
          error={hasError && !aarsakErAnnet && 'Du må velge en årsak før du kan fortsette.'}
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
                  hasError &&
                  aarsakErAnnet &&
                  'Du må fylle ut for årsak "annet" før du kan fortsette.'
                }
                maxLength={BESKRIVELSE_MAX_TEGN}
                aria-label={'Beskrivelse for Annet'}
              />
            )}
          </>
        </RadioGroup>
        <Alert variant="info" className="mt-4">
          Når du lagrer så blir det sendt varsel til bruker. Har personen registrert seg i KRR så
          blir det sendt brev. Arrangør og bruker ser endringen.
        </Alert>
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
