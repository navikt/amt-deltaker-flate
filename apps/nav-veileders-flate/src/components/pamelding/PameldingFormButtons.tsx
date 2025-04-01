import { Alert, BodyLong, Button, HelpText, HStack } from '@navikt/ds-react'
import {
  DeferredFetchState,
  DeltakerStatusType,
  hentTiltakNavnHosArrangorTekst,
  Oppstartstype,
  useDeferredFetch
} from 'deltaker-flate-common'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { deletePamelding, sendInnPamelding } from '../../api/api.ts'
import { PameldingResponse } from '../../api/data/pamelding.ts'
import { useAppContext } from '../../AppContext.tsx'
import {
  DELTAKELSESOVERSIKT_LINK,
  useModiaLink
} from '../../hooks/useModiaLink.ts'
import { PameldingFormValues } from '../../model/PameldingFormValues.ts'
import { ErrorPage } from '../../pages/ErrorPage.tsx'
import { getDeltakerNavn } from '../../utils/displayText.ts'
import { generatePameldingRequestFromForm } from '../../utils/pamelding-form-utils.ts'
import { DelUtkastModal } from '../opprett-pamelding/DelUtkastModal.tsx'
import { ForkastUtkastEndringModal } from '../opprett-pamelding/ForkastUtkastEndringModal.tsx'
import { SlettKladdModal } from '../opprett-pamelding/SlettKladdModal.tsx'

interface Props {
  pamelding: PameldingResponse
  disabled: boolean
  disableForm: (disable: boolean) => void
  onCancelUtkast?: () => void
  onDelEndring?: (pamelding: PameldingResponse) => void
  onSubmitError?: () => void
}

export const PameldingFormButtons = ({
  pamelding,
  disabled,
  disableForm,
  onCancelUtkast,
  onDelEndring,
  onSubmitError
}: Props) => {
  const erUtkast =
    pamelding.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING
  const erKladd = !erUtkast
  const kanDeleUtkast = pamelding.digitalBruker
  const harAdresse = pamelding.harAdresse

  const erFellesOppstart =
    pamelding.deltakerliste.oppstartstype === Oppstartstype.FELLES
  const delEndringKnappTekst = erUtkast
    ? 'Del endring'
    : `Del utkast og gjør klar ${erFellesOppstart ? 'søknad' : 'påmelding'}`

  const { doRedirect } = useModiaLink()
  const { enhetId } = useAppContext()
  const returnToFrontpage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK)
  }
  const returnToFrontpageWithSuccessMessage = () => {
    doRedirect(DELTAKELSESOVERSIKT_LINK, {
      heading: 'Utkastet er delt med bruker',
      body: erFellesOppstart
        ? `Søknaden er gjort klart. Når brukeren godtar, blir de søkt inn på ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakstype, pamelding.deltakerliste.arrangorNavn)}.`
        : `Vedtaket er gjort klart. Når brukeren godtar, så fattes vedtaket om ${hentTiltakNavnHosArrangorTekst(pamelding.deltakerliste.tiltakstype, pamelding.deltakerliste.arrangorNavn)}.`
    })
  }

  const { handleSubmit, getValues } = useFormContext<PameldingFormValues>()

  const [delUtkastModalOpen, setDelUtkastModalOpen] = useState(false)
  const [formData, setFormData] = useState(getValues())
  const [slettKladdModalOpen, setSlettKladdModalOpen] = useState(false)
  const [forkastUtkastEndringModalOpen, setForkastUtkastEndringModalOpen] =
    useState(false)
  const [isDisabled, setIsDisabled] = useState(disabled)

    console.log('formData', formData)

    const {
      state: sendSomForslagState,
      error: sendSomForslagError,
      doFetch: doFetchSendSomForslag
    } = useDeferredFetch(
      sendInnPamelding,
      erUtkast ? undefined : returnToFrontpageWithSuccessMessage
    )
    const {
      state: slettKladdState,
      error: slettKladdError,
      doFetch: doFetchSlettKladd
    } = useDeferredFetch(deletePamelding, returnToFrontpage)

    const delUtkast = (newFormData: PameldingFormValues) => {
      console.log('delUtkast', newFormData)
      doFetchSendSomForslag(
        pamelding.deltakerId,
        enhetId,
        generatePameldingRequestFromForm(pamelding, newFormData)
      ).then((res) => {
        if (onDelEndring !== undefined && res !== null) {
          onDelEndring(res)
        }
      })
    }

    const handleFormSubmit = (newFormData: PameldingFormValues) => {
      console.log('handleFormSubmit', newFormData)
      setFormData(newFormData)
      if (pamelding.status.type === DeltakerStatusType.UTKAST_TIL_PAMELDING) {
        delUtkast(newFormData)
      } else setDelUtkastModalOpen(true)
    }

  useEffect(() => {
    const isLoading =
      sendSomForslagState === DeferredFetchState.LOADING ||
      slettKladdState === DeferredFetchState.LOADING

    setIsDisabled(isLoading || disabled)
    disableForm(isLoading || disabled)
  }, [sendSomForslagState, slettKladdState, disabled])

  return (
    <>
      {sendSomForslagState === DeferredFetchState.ERROR && (
        <ErrorPage message={sendSomForslagError} />
      )}

      {slettKladdError === DeferredFetchState.ERROR && (
        <ErrorPage message={slettKladdError} />
      )}

      {sendSomForslagState === DeferredFetchState.RESOLVED && (
        <Alert variant="success" className="mt-4 mb-4">
          Forslag er sendt til brukeren!
        </Alert>
      )}

      {slettKladdState === DeferredFetchState.RESOLVED && (
        <Alert variant="success" className="mt-4 mb-4">
          Kladden har blitt slettet
        </Alert>
      )}

      <HStack gap="4" className="mt-8">
        {kanDeleUtkast && (
          <div className="flex items-center">
            <Button
              size="small"
              disabled={isDisabled}
              type="button"
              onClick={handleSubmit(handleFormSubmit, onSubmitError)}
              loading={sendSomForslagState === DeferredFetchState.LOADING}
            >
              {delEndringKnappTekst}
            </Button>
            {erKladd && (
              <div className="ml-2">
                <HelpText aria-label={`Hjelpetekst: ${delEndringKnappTekst}`}>
                  {`Når utkastet deles med bruker så kan de lese gjennom hva du foreslår å sende til arrangøren. Bruker blir varslet og kan finne lenke på innlogget nav.no og gjennom aktivitetsplanen. Når brukeren godtar utkastet, så ${erFellesOppstart ? 'søkes de inn' : 'fattes vedtaket'}.`}
                </HelpText>
              </div>
            )}
          </div>
        )}
        {!kanDeleUtkast && harAdresse && (
          <div className="flex items-center">
            <Alert variant="warning" size="small">
              Kan ikke kontaktes digitalt
            </Alert>
          </div>
        )}
        {!kanDeleUtkast && !harAdresse && (
          <div className="flex items-center">
            <Alert variant="warning" size="small">
              <BodyLong className="mt-1" size="small">
                Personen er reservert mot digital kommunikasjon, og har heller
                ingen registrert kontaktadresse. De vil derfor ikke motta et
                varsel. Brevet som journalføres i Gosys må skrives ut og leveres
                til personen på annen måte.
              </BodyLong>
            </Alert>
          </div>
        )}

        {erKladd && (
          <Button
            variant="tertiary"
            size="small"
            type="button"
            disabled={isDisabled}
            onClick={() => setSlettKladdModalOpen(true)}
            loading={slettKladdState === DeferredFetchState.LOADING}
          >
            Slett kladd
          </Button>
        )}
        {erUtkast && (
          <Button
            variant="tertiary"
            size="small"
            type="button"
            disabled={isDisabled}
            onClick={() => setForkastUtkastEndringModalOpen(true)}
          >
            Forkast endring
          </Button>
        )}
      </HStack>

      <ForkastUtkastEndringModal
        open={forkastUtkastEndringModalOpen}
        onConfirm={() => {
          setForkastUtkastEndringModalOpen(false)
          if (onCancelUtkast) onCancelUtkast()
        }}
        onCancel={() => {
          setForkastUtkastEndringModalOpen(false)
        }}
      />

      <SlettKladdModal
        open={slettKladdModalOpen}
        oppstartstype={pamelding.deltakerliste.oppstartstype}
        onConfirm={() => {
          doFetchSlettKladd(pamelding.deltakerId)
          setSlettKladdModalOpen(false)
        }}
        onCancel={() => {
          setSlettKladdModalOpen(false)
        }}
      />

      <DelUtkastModal
        open={delUtkastModalOpen}
        onConfirm={() => {
          delUtkast(formData)
          setDelUtkastModalOpen(false)
        }}
        onCancel={() => {
          setDelUtkastModalOpen(false)
        }}
        deltakerNavn={getDeltakerNavn(pamelding)}
        tiltakstype={pamelding.deltakerliste.tiltakstype}
        arrangorNavn={pamelding.deltakerliste.arrangorNavn}
        oppstartstype={pamelding.deltakerliste.oppstartstype}
      />
    </>
  )
}
