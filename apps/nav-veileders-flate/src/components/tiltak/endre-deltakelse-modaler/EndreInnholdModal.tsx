import {
  BodyLong,
  Checkbox,
  CheckboxGroup,
  Detail,
  Modal,
  Textarea
} from '@navikt/ds-react'
import { EndringTypeIkon } from '../EndringTypeIkon'
import { EndreDeltakelseType } from '../../../api/data/endre-deltakelse-request'
import {
  DeferredFetchState,
  useDeferredFetch
} from '../../../hooks/useDeferredFetch'
import { ModalFooter } from '../../ModalFooter'
import { PameldingResponse } from '../../../api/data/pamelding'
import { endreDeltakelseInnhold } from '../../../api/api'
import { useAppContext } from '../../../AppContext'
import { INNHOLD_TYPE_ANNET } from '../../../utils/utils'
import {
  BESKRIVELSE_ANNET_MAX_TEGN,
  generateValgtInnholdKoder
} from '../../../model/PameldingFormValues'
import { useState } from 'react'
import { generateInnholdFromResponse } from '../../../utils/pamelding-form-utils'
import { ErrorPage } from '../../../pages/ErrorPage.tsx'

interface EndreInnholdModalProps {
  pamelding: PameldingResponse
  open: boolean
  onClose: () => void
  onSuccess: (oppdatertPamelding: PameldingResponse | null) => void
}

export const EndreInnholdModal = ({
  pamelding,
  open,
  onClose,
  onSuccess
}: EndreInnholdModalProps) => {
  const innhold = pamelding.deltakelsesinnhold?.innhold ?? []
  const [valgteInnhold, setValgteInnhold] = useState<string[] | []>(
    generateValgtInnholdKoder(pamelding)
  )
  const [hasError, setHasError] = useState<boolean>(false)
  const { enhetId } = useAppContext()

  const [annetBeskrivelse, setAnnetBeskrivelse] = useState<
    string | null | undefined
  >(
    innhold
      .filter((i) => i.valgt)
      .find((i) => i.innholdskode === INNHOLD_TYPE_ANNET)?.beskrivelse
  )
  const harAnnetBeskrivelse = annetBeskrivelse && annetBeskrivelse.length > 0
  const erAnnetValgt =
    valgteInnhold.find((vi) => vi === INNHOLD_TYPE_ANNET) !== undefined

  const {
    state: endreDeltakelseState,
    error: endreDeltakelseError,
    doFetch: doFetchEndreDeltakelseInnhold
  } = useDeferredFetch(endreDeltakelseInnhold)

  const sendEndring = () => {
    const innholdFromRepsonse = generateInnholdFromResponse(
      pamelding,
      valgteInnhold,
      annetBeskrivelse
    )
    if (
      valgteInnhold.length > 0 &&
      (!erAnnetValgt || (erAnnetValgt && harAnnetBeskrivelse))
    ) {
      doFetchEndreDeltakelseInnhold(pamelding.deltakerId, enhetId, {
        innhold: innholdFromRepsonse
      }).then((data) => {
        onSuccess(data)
      })
    } else setHasError(true)
  }

  return (
    <Modal
      open={open}
      header={{
        icon: <EndringTypeIkon type={EndreDeltakelseType.ENDRE_INNHOLD} />,
        heading: 'Endre innhold'
      }}
      onClose={onClose}
    >
      <Modal.Body>
        {endreDeltakelseState === DeferredFetchState.ERROR && (
          <ErrorPage message={endreDeltakelseError} />
        )}

        <section className="space-y-4">
          <Detail size="small">
            Når du lagrer så får bruker beskjed gjennom nav.no. Arrangør ser
            også endringen.
          </Detail>
          <BodyLong size="small">
            {pamelding.deltakelsesinnhold?.ledetekst ?? ''}
          </BodyLong>
        </section>

        <section className="mt-4">
          {innhold.length > 0 && (
            <CheckboxGroup
              defaultValue={valgteInnhold}
              legend="Hva mer skal tiltaket inneholde?"
              error={
                hasError &&
                !erAnnetValgt &&
                'Du må velge innhold før du kan fortsette.'
              }
              size="small"
              aria-required
              id="endreValgteInnhold"
              onChange={(value: string[]) => {
                setValgteInnhold(value)
                setHasError(false)
              }}
            >
              {innhold.map((e) => (
                <div key={e.innholdskode}>
                  <Checkbox value={e.innholdskode}>{e.tekst}</Checkbox>
                  {e.innholdskode === INNHOLD_TYPE_ANNET && erAnnetValgt && (
                    <Textarea
                      onChange={(e) => {
                        setAnnetBeskrivelse(e.target.value)
                        setHasError(false)
                      }}
                      label={null}
                      value={annetBeskrivelse ?? ''}
                      aria-label={'Beskrivelse av innhold "Annet"'}
                      aria-required
                      maxLength={BESKRIVELSE_ANNET_MAX_TEGN}
                      size="small"
                      id="innholdAnnetBeskrivelse"
                      error={
                        hasError &&
                        erAnnetValgt &&
                        'Du må fylle ut for beskrivelse for "annet" før du kan fortsette.'
                      }
                    />
                  )}
                </div>
              ))}
            </CheckboxGroup>
          )}
        </section>
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
