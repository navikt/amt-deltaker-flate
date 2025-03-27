import { TasklistIcon, XMarkIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { useEffect, useRef, useState } from 'react'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext'
import { HandlingModalController } from './HandlingModalController'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import { Tiltakskode } from 'deltaker-flate-common'

interface Props {
  className?: string
}

export const HandlingerKnapp = ({ className }: Props) => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { handlingValg, setHandlingValg, setValgteDeltakere } =
    useHandlingContext()
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

  return (
    <div className={`flex gap-3 ${className ?? ''}`}>
      {handlingValg !== null && (
        <>
          {handlingValg === HandlingValg.DEL_DELTAKERE && (
            <Button size="small" onClick={() => setModalOpen(true)}>
              Del med arrangør
            </Button>
          )}
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
          <ActionMenu.Content>
            <ActionMenu.Group className="w-[16rem]">
              <ActionMenu.Item
                onSelect={(e: React.MouseEvent) => {
                  e.preventDefault()
                  setHandlingValg(HandlingValg.DEL_DELTAKERE)
                }}
              >
                <div className="p-1 flex items-start">
                  <TasklistIcon
                    width="1.125rem"
                    height="1.125rem"
                    className="mt-[0.15rem] mr-1"
                  />
                  Velg deltakere som skal deles med arrangør
                </div>
              </ActionMenu.Item>
            </ActionMenu.Group>
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
