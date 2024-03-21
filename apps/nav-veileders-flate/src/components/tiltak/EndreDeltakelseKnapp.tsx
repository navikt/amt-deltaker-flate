import { PencilIcon } from '@navikt/aksel-icons'
import { Button, Dropdown } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { DeltakerStatusType, PameldingResponse } from '../../api/data/pamelding.ts'
import { EndringTypeIkon } from './EndringTypeIkon.tsx'
import { EndreDeltakelseType } from '../../api/data/endre-deltakelse-request.ts'
import { usePameldingCOntext } from './PameldingContext.tsx'
import { ModalController } from './endre-deltakelse-modaler/ModalController.tsx'
import { getEndreDeltakelseTypeText } from '../../utils/displayText.ts'
import { dateStrToDate, dateStrToNullableDate } from '../../utils/utils.ts'

const hentEndreDeltakelseKnappValg = (
  endringsType: EndreDeltakelseType,
  onClick: (type: EndreDeltakelseType) => void
) => (
  <Dropdown.Menu.List.Item onClick={() => onClick(endringsType)}>
    <EndringTypeIkon type={endringsType} />
    {getEndreDeltakelseTypeText(endringsType)}
  </Dropdown.Menu.List.Item>
)

export const EndreDeltakelseKnapp = () => {
  const { pamelding, setPamelding } = usePameldingCOntext()
  const endreDeltakelseRef = useRef<HTMLButtonElement>(null)
  const [modalType, setModalType] = useState<EndreDeltakelseType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = (type: EndreDeltakelseType) => {
    setModalType(type)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalType(null)
    setModalOpen(false)
    endreDeltakelseRef?.current?.focus()
  }

  const handleEndringUtført = (oppdatertPamelding: PameldingResponse | null) => {
    handleCloseModal()
    if (oppdatertPamelding) {
      setPamelding(oppdatertPamelding)
    }
  }

  const sluttdato = dateStrToNullableDate(pamelding.sluttdato)
  const statusdato = dateStrToDate(pamelding.status.gyldigFra)
  const toMndSiden = new Date()
  toMndSiden.setMonth(toMndSiden.getMonth() - 2)

  const statusErVenterPaOppstartEllerDeltar =
    pamelding.status.type === DeltakerStatusType.VENTER_PA_OPPSTART ||
    pamelding.status.type === DeltakerStatusType.DELTAR

  const deltakerHarSluttetEllerFullfort =
    pamelding.status.type === DeltakerStatusType.HAR_SLUTTET ||
    pamelding.status.type === DeltakerStatusType.FULLFORT ||
    pamelding.status.type === DeltakerStatusType.AVBRUTT

  const deltakerHarAvsluttendeStatus =
      pamelding.status.type === DeltakerStatusType.HAR_SLUTTET ||
      pamelding.status.type === DeltakerStatusType.FULLFORT ||
      pamelding.status.type === DeltakerStatusType.AVBRUTT ||
      pamelding.status.type === DeltakerStatusType.IKKE_AKTUELL ||
      pamelding.status.type === DeltakerStatusType.AVBRUTT_UTKAST ||
      pamelding.status.type === DeltakerStatusType.FEILREGISTRERT

  const harSluttetKanEndres =
      deltakerHarAvsluttendeStatus && statusdato > toMndSiden && pamelding.kanEndres

  const skalViseForlengKnapp =
      sluttdato &&
      (pamelding.status.type === DeltakerStatusType.DELTAR ||
          (pamelding.status.type === DeltakerStatusType.HAR_SLUTTET && statusdato > toMndSiden && pamelding.kanEndres))

  const skalViseEndreSluttarsakKnapp =
      pamelding.status.type === DeltakerStatusType.HAR_SLUTTET && statusdato > toMndSiden && pamelding.kanEndres

  const skalViseEndreOppstarsdato =
      // (pamelding.status.type === DeltakerStatusType.VENTER_PA_OPPSTART && startdato) ||
      // TODO når tiltakarrangor kan sette startDato skal vi bruke sjekken over:
      // altså VENTER_PA_OPPSTART må ha startDato satt for at vi kan endre Oppstartsdato for den statusen
      pamelding.status.type === DeltakerStatusType.VENTER_PA_OPPSTART ||
      pamelding.status.type === DeltakerStatusType.DELTAR ||
      harSluttetKanEndres

  return (
    <>
      <Dropdown>
        <Button
          ref={endreDeltakelseRef}
          as={Dropdown.Toggle}
          variant="secondary"
          size="small"
          icon={<PencilIcon aria-hidden />}
        >
          Endre deltakelse
        </Button>
        <Dropdown.Menu>
          <Dropdown.Menu.List>
            {skalViseEndreOppstarsdato &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.ENDRE_OPPSTARTSDATO, openModal)}
            {pamelding.status.type === DeltakerStatusType.VENTER_PA_OPPSTART &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.IKKE_AKTUELL, openModal)}
            {skalViseForlengKnapp &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.FORLENG_DELTAKELSE, openModal)}
            {(statusErVenterPaOppstartEllerDeltar || harSluttetKanEndres) &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.ENDRE_INNHOLD, openModal)}
            {(statusErVenterPaOppstartEllerDeltar || harSluttetKanEndres) &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.ENDRE_BAKGRUNNSINFO, openModal)}
            {pamelding.status.type === DeltakerStatusType.DELTAR &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.AVSLUTT_DELTAKELSE, openModal)}
            {deltakerHarSluttetEllerFullfort && harSluttetKanEndres &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.ENDRE_SLUTTDATO, openModal)}
            {skalViseEndreSluttarsakKnapp &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.ENDRE_SLUTTARSAK, openModal)}
          </Dropdown.Menu.List>
        </Dropdown.Menu>
      </Dropdown>

      <ModalController
        endringsType={modalType}
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleEndringUtført}
        pamelding={pamelding}
      />
    </>
  )
}
