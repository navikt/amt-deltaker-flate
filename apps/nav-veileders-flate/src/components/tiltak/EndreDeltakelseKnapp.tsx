import { PencilIcon } from '@navikt/aksel-icons'
import { Button, Dropdown } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { DeltakerStatusType, PameldingResponse, Tiltakstype } from '../../api/data/pamelding.ts'
import { EndringTypeIkon } from './EndringTypeIkon.tsx'
import { EndreDeltakelseType } from '../../api/data/endre-deltakelse-request.ts'
import { usePameldingContext } from './PameldingContext.tsx'
import { ModalController } from './endre-deltakelse-modaler/ModalController.tsx'
import { getEndreDeltakelseTypeText } from '../../utils/displayText.ts'
import { dateStrToDate, dateStrToNullableDate } from '../../utils/utils.ts'
import {
  deltakerHarAvsluttendeStatus,
  deltakerHarSluttetEllerFullfort,
  deltakerVenterPaOppstartEllerDeltar
} from '../../utils/statusutils.ts'

const hentEndreDeltakelseKnappValg = (
  endringsType: EndreDeltakelseType,
  onClick: (type: EndreDeltakelseType) => void
) => (
  <Dropdown.Menu.List.Item onClick={() => onClick(endringsType)}>
    <EndringTypeIkon type={endringsType} />
    {getEndreDeltakelseTypeText(endringsType)}
  </Dropdown.Menu.List.Item>
)

const harSluttetKanEndres = (pamelding: PameldingResponse, statusdato: Date, toMndSiden: Date) =>
  pamelding.status.type === DeltakerStatusType.HAR_SLUTTET &&
  statusdato > toMndSiden &&
  pamelding.kanEndres

const harAvsluttendeStatusKanEndres = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  deltakerHarAvsluttendeStatus(pamelding.status.type) &&
  statusdato > toMndSiden &&
  pamelding.kanEndres

const venterDeltarEllerKanEndres = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  deltakerVenterPaOppstartEllerDeltar(pamelding.status.type) ||
  harAvsluttendeStatusKanEndres(pamelding, statusdato, toMndSiden)

const skalViseForlengKnapp = (
  pamelding: PameldingResponse,
  sluttdato: Date | null,
  statusdato: Date,
  toMndSiden: Date
) =>
  sluttdato &&
  (pamelding.status.type === DeltakerStatusType.DELTAR ||
    harSluttetKanEndres(pamelding, statusdato, toMndSiden))

const skalViseEndreInnholdKnapp = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  venterDeltarEllerKanEndres(pamelding, statusdato, toMndSiden) &&
  pamelding.deltakerliste.tiltakstype !== Tiltakstype.VASV

const skalViseEndreSluttdatoKnapp = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  deltakerHarSluttetEllerFullfort(pamelding.status.type) &&
  harSluttetKanEndres(pamelding, statusdato, toMndSiden)

const skalViseEndreDeltakelsesmengde = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  (pamelding.deltakerliste.tiltakstype === Tiltakstype.VASV ||
    pamelding.deltakerliste.tiltakstype === Tiltakstype.ARBFORB) &&
  venterDeltarEllerKanEndres(pamelding, statusdato, toMndSiden)

const skalViseEndreOppstartsdato = (
  pamelding: PameldingResponse,
  statusdato: Date,
  toMndSiden: Date
) =>
  // (pamelding.status.type === DeltakerStatusType.VENTER_PA_OPPSTART && startdato) ||
  // TODO når tiltakarrangor kan sette startDato skal vi bruke sjekken over:
  // altså VENTER_PA_OPPSTART må ha startDato satt for at vi kan endre Oppstartsdato for den statusen
  deltakerVenterPaOppstartEllerDeltar(pamelding.status.type) ||
  harAvsluttendeStatusKanEndres(pamelding, statusdato, toMndSiden)

export const EndreDeltakelseKnapp = () => {
  const { pamelding, setPamelding } = usePameldingContext()
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

  return (
    <>
      <Dropdown>
        <Button
          ref={endreDeltakelseRef}
          as={Dropdown.Toggle}
          variant="secondary"
          size="small"
          className="w-fit"
          icon={<PencilIcon aria-hidden />}
        >
          Endre deltakelse
        </Button>
        <Dropdown.Menu>
          <Dropdown.Menu.List>
            {skalViseEndreOppstartsdato(pamelding, statusdato, toMndSiden) &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.ENDRE_OPPSTARTSDATO, openModal)}
            {pamelding.status.type === DeltakerStatusType.VENTER_PA_OPPSTART &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.IKKE_AKTUELL, openModal)}
            {skalViseForlengKnapp(pamelding, sluttdato, statusdato, toMndSiden) &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.FORLENG_DELTAKELSE, openModal)}
            {skalViseEndreInnholdKnapp(pamelding, statusdato, toMndSiden) &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.ENDRE_INNHOLD, openModal)}
            {venterDeltarEllerKanEndres(pamelding, statusdato, toMndSiden) &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.ENDRE_BAKGRUNNSINFO, openModal)}
            {pamelding.status.type === DeltakerStatusType.DELTAR &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.AVSLUTT_DELTAKELSE, openModal)}
            {skalViseEndreSluttdatoKnapp(pamelding, statusdato, toMndSiden) &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.ENDRE_SLUTTDATO, openModal)}
            {harSluttetKanEndres(pamelding, statusdato, toMndSiden) &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.ENDRE_SLUTTARSAK, openModal)}
            {skalViseEndreDeltakelsesmengde(pamelding, statusdato, toMndSiden) &&
              hentEndreDeltakelseKnappValg(EndreDeltakelseType.ENDRE_DELTAKELSESMENGDE, openModal)}
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
