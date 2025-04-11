import {
  MenuElipsisHorizontalCircleIcon,
  TasklistSendIcon,
  XMarkIcon
} from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { Tiltakskode } from 'deltaker-flate-common'
import { useEffect, useRef, useState } from 'react'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext'
import { HandlingModalController } from './HandlingModalController'
import { useFeatureToggles } from '../../hooks/useFeatureToggles.ts'

interface Props {
  className?: string
}

export const HandlingerKnapp = ({ className }: Props) => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { handlingValg, setHandlingValg, setValgteDeltakere } =
    useHandlingContext()
  const { erKometMasterForTiltak } = useFeatureToggles()
  const kometErMaster = erKometMasterForTiltak(
    deltakerlisteDetaljer.tiltakskode
  )
  const [modalOpen, setModalOpen] = useState(false)
  const handlingValgRef = useRef<HandlingValg | null>(null)
  const handlingKnappRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (handlingValg === handlingValgRef.current) {
      return
    } else {
      handlingValgRef.current = handlingValg
    }
    if (handlingKnappRef.current) {
      handlingKnappRef.current.focus()
    }
  }, [handlingValg])

  const kanDeleMedArrangor =
    deltakerlisteDetaljer.tiltakskode ==
      Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING ||
    deltakerlisteDetaljer.tiltakskode ==
      Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING
  if (!kanDeleMedArrangor) {
    return <div className="mt-8"></div>
  }

  function getKnappHandlingText(handlingValg: HandlingValg) {
    switch (handlingValg) {
      case HandlingValg.DEL_DELTAKERE:
        return 'Del med arrangør'
      case HandlingValg.SETT_PA_VENTELISTE:
        return 'Sett på venteliste'
    }
  }

  return (
    <div className={`flex gap-3 ${className ?? ''}`}>
      {handlingValg !== null && (
        <>
          <Button size="small" onClick={() => setModalOpen(true)}>
            {getKnappHandlingText(handlingValg)}
          </Button>

          <Button
            size="small"
            variant="secondary"
            icon={<XMarkIcon aria-hidden />}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault()
              setHandlingValg(null)
              setValgteDeltakere([])
            }}
          >
            Avbryt
          </Button>
        </>
      )}

      {handlingValg === null && (
        <ActionMenu>
          <ActionMenu.Trigger>
            <Button ref={handlingKnappRef} size="small">
              Handlinger
            </Button>
          </ActionMenu.Trigger>
          <ActionMenu.Content className="w-[16rem]">
            <ActionMenu.Item
              onSelect={(e: Event) => {
                e.preventDefault()
                setHandlingValg(HandlingValg.DEL_DELTAKERE)
              }}
            >
              <div className="p-1 flex items-start">
                <TasklistSendIcon
                  width="1.125rem"
                  height="1.125rem"
                  className="mt-[0.15rem] mr-1"
                  aria-hidden
                />
                Velg deltakere som skal deles med arrangør
              </div>
            </ActionMenu.Item>

            {kometErMaster && (
              <ActionMenu.Item
                onSelect={(e: Event) => {
                  e.preventDefault()
                  setHandlingValg(HandlingValg.SETT_PA_VENTELISTE)
                }}
              >
                <div className="p-1 flex items-start">
                  <MenuElipsisHorizontalCircleIcon
                    width="1.125rem"
                    height="1.125rem"
                    className="mt-[0.15rem] mr-1"
                    color="var(--a-lightblue-800)"
                    aria-hidden
                  />
                  Sett på venteliste
                </div>
              </ActionMenu.Item>
            )}
          </ActionMenu.Content>
        </ActionMenu>
      )}

      {handlingValg && (
        <HandlingModalController
          handlingValg={handlingValg}
          modalOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSend={() => {
            setModalOpen(false)
            setValgteDeltakere([])
            setHandlingValg(null)
          }}
        />
      )}
    </div>
  )
}
