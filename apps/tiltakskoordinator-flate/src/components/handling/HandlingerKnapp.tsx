import {
  CheckmarkCircleIcon,
  MenuElipsisHorizontalCircleIcon,
  PlusCircleFillIcon,
  TasklistSendIcon,
  XMarkIcon
} from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { useEffect, useRef } from 'react'
import { useDeltakerlisteContext } from '../../context-providers/DeltakerlisteContext'
import {
  HandlingValg,
  useHandlingContext
} from '../../context-providers/HandlingContext'
import { useShadowDom } from '../../context-providers/ShadowDomContext'
import { useFeatureToggles } from '../../hooks/useFeatureToggles.ts'
import { kanDeleDeltakerMedArrangorForVurdering } from 'deltaker-flate-common'

interface Props {
  onModalOpen: () => void
  className?: string
}

export const HandlingerKnapp = ({ onModalOpen, className }: Props) => {
  const { deltakerlisteDetaljer } = useDeltakerlisteContext()
  const { handlingValg, setHandlingValg, setValgteDeltakere } =
    useHandlingContext()
  const { erKometMasterForTiltak } = useFeatureToggles()
  const { containerElement } = useShadowDom()
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

  const kanDeleMedArrangor = kanDeleDeltakerMedArrangorForVurdering(
    deltakerlisteDetaljer.pameldingstype,
    deltakerlisteDetaljer.tiltakskode
  )

  // TODO denne er kanskje ikke riktig lenger? Kanskje bare komet må være master?
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
        <ActionMenu rootElement={containerElement}>
          <ActionMenu.Trigger>
            <Button ref={handlingKnappRef} size="small">
              Handlinger
            </Button>
          </ActionMenu.Trigger>
          <ActionMenu.Content className="max-w-56">
            {kanDeleMedArrangor && (
              <ActionMenu.Item
                onSelect={(e: Event) => {
                  e.preventDefault()
                  setHandlingValg(HandlingValg.DEL_DELTAKERE)
                }}
              >
                <div className="p-1 flex gap-1 items-center">
                  <TasklistSendIcon
                    className="mt-1 place-self-start"
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
                <div className="p-1 flex gap-1 items-center">
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
                <div className="p-1 flex gap-1 items-center">
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
                <div className="p-1 flex gap-1 items-center">
                  <PlusCircleFillIcon
                    width="1.125rem"
                    height="1.125rem"
                    className="rotate-45"
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
