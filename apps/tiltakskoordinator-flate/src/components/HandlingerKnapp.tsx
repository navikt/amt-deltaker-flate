import { TasklistIcon, XMarkIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { useState } from 'react'
import {
  HandlingValg,
  useHandlingContext
} from '../context-providers/HandlingContext'
import { HandlingModal } from './HandlingModal'

interface Props {
  className?: string
}

export const HandlingerKnapp = ({ className }: Props) => {
  const { handlingValg, setHandlingValg, setValgteDeltakere } =
    useHandlingContext()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className={`flex gap-2 ${className ?? ''}`}>
      {handlingValg !== null && (
        <>
          <Button
            size="small"
            variant="secondary"
            icon={<XMarkIcon aria-hidden />}
            onClick={() => {
              setHandlingValg(null)
              setValgteDeltakere([])
            }}
          >
            Avbryt
          </Button>
          {handlingValg === HandlingValg.DEL_DELTAKERE && (
            <Button size="small" onClick={() => setModalOpen(true)}>
              Del med arrangør
            </Button>
          )}
        </>
      )}

      {handlingValg === null && (
        <ActionMenu>
          <ActionMenu.Trigger>
            <Button size="small">Handlinger</Button>
          </ActionMenu.Trigger>
          <ActionMenu.Content className="w-[16rem]">
            <ActionMenu.Group>
              <ActionMenu.Item
                onSelect={() => setHandlingValg(HandlingValg.DEL_DELTAKERE)}
              >
                <div className="p-1 flex items-start gap-1">
                  <TasklistIcon
                    width="1.125rem"
                    height="1.125rem"
                    className="mt-[0.1rem]"
                  />
                  Velg deltakere som skal deles med arrangør
                </div>
              </ActionMenu.Item>
            </ActionMenu.Group>
          </ActionMenu.Content>
        </ActionMenu>
      )}

      <HandlingModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
        }}
        onSend={() => {
          setModalOpen(false)
          setValgteDeltakere([])
          setHandlingValg(null)
        }}
      />
    </div>
  )
}
