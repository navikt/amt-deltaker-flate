import {
  CheckmarkCircleIcon,
  MenuElipsisHorizontalCircleIcon,
  PlusCircleFillIcon,
  TasklistSendIcon,
  XMarkIcon
} from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { Tiltakskode } from 'deltaker-flate-common'
import { useEffect, useRef } from 'react'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext'
import { useFeatureToggles } from '../../hooks/useFeatureToggles.ts'

interface Props {
  onModalOpen: () => void
  className?: string
}

export const HandlingerKnapp = ({ onModalOpen, className }: Props) => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { handlingValg, setHandlingValg, setValgteDeltakere } =
    useHandlingContext()
  const { erKometMasterForTiltak } = useFeatureToggles()
  const kometErMaster = erKometMasterForTiltak(
    deltakerlisteDetaljer.tiltakskode
  )
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

  function getKnappHandlingText(handlingValg: HandlingValg) {
    switch (handlingValg) {
      case HandlingValg.DEL_DELTAKERE:
        return 'Del med arrangør'
      case HandlingValg.SETT_PA_VENTELISTE:
        return 'Sett på venteliste'
      case HandlingValg.TILDEL_PLASS:
        return 'Tildel plass'
      case HandlingValg.GI_AVSLAG:
        return 'Gi avslag'
    }
  }

  const kanDeleMedArrangor =
    deltakerlisteDetaljer.tiltakskode ==
      Tiltakskode.GRUPPE_ARBEIDSMARKEDSOPPLAERING ||
    deltakerlisteDetaljer.tiltakskode ==
      Tiltakskode.GRUPPE_FAG_OG_YRKESOPPLAERING

  if (!kanDeleMedArrangor && !kometErMaster) {
    return <div className="mt-8"></div>
  }

  return (
    <div className={`flex gap-3 ${className ?? ''}`}>
      {handlingValg !== null && (
        <>
          {handlingValg !== HandlingValg.GI_AVSLAG && (
            <Button size="small" onClick={onModalOpen}>
              {getKnappHandlingText(handlingValg)}
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
          <ActionMenu.Content style={{ width: '16rem' }}>
            {kanDeleMedArrangor && (
              <ActionMenu.Item
                onSelect={(e: Event) => {
                  e.preventDefault()
                  setHandlingValg(HandlingValg.DEL_DELTAKERE)
                }}
              >
                <div className="p-1" style={getHandlingValgStyle()}>
                  <TasklistSendIcon
                    width="1.125rem"
                    height="1.125rem"
                    aria-hidden
                  />
                  Velg deltakere som skal deles med arrangør
                </div>
              </ActionMenu.Item>
            )}

            {kometErMaster && (
              <ActionMenu.Item
                onSelect={(e: Event) => {
                  e.preventDefault()
                  setHandlingValg(HandlingValg.TILDEL_PLASS)
                }}
              >
                <div className="p-1" style={getHandlingValgStyle()}>
                  <CheckmarkCircleIcon
                    width="1.125rem"
                    height="1.125rem"
                    color="var(--a-icon-success)"
                    aria-hidden
                  />
                  Tildel plass
                </div>
              </ActionMenu.Item>
            )}

            {kometErMaster && (
              <ActionMenu.Item
                onSelect={(e: Event) => {
                  e.preventDefault()
                  setHandlingValg(HandlingValg.SETT_PA_VENTELISTE)
                }}
              >
                <div className="p-1" style={getHandlingValgStyle()}>
                  <MenuElipsisHorizontalCircleIcon
                    width="1.125rem"
                    height="1.125rem"
                    color="var(--a-lightblue-800)"
                    aria-hidden
                  />
                  Sett på venteliste
                </div>
              </ActionMenu.Item>
            )}

            {kometErMaster && (
              <ActionMenu.Item
                onSelect={(e: Event) => {
                  e.preventDefault()
                  setHandlingValg(HandlingValg.GI_AVSLAG)
                }}
              >
                <div className="p-1" style={getHandlingValgStyle()}>
                  <PlusCircleFillIcon
                    width="1.125rem"
                    height="1.125rem"
                    style={{ rotate: '45deg' }}
                    aria-hidden
                    color="var(--a-orange-600)"
                  />
                  Gi avslag
                </div>
              </ActionMenu.Item>
            )}
          </ActionMenu.Content>
        </ActionMenu>
      )}
    </div>
  )
}

const getHandlingValgStyle = () => {
  return {
    display: 'flex',
    gap: '0.25rem',
    alignItems: 'center'
  }
}
