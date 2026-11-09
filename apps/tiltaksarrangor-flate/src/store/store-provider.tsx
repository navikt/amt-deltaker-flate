import type { ReactNode } from 'react'
import { TilbakelenkeContextProvider } from './TilbakelenkeContextProvider'
import { DeltakerSorteringContextProvider } from './DeltakerSorteringContextProvider'
import { InnloggetBrukerContextProvider } from './InnloggetBrukerContextProvider'
import { KoordinatorsDeltakerlisterContextProvider } from './KoordinatorsDeltakerlisterContextProvider'
import { ScrollPositionContextProvider } from './ScrollPositionContextProvider'
import { KoordinatorFilterContextProvider } from '../component/page/deltakerliste-detaljer/store/KoordinatorFilterContextProvider'
import { VeilederFilterContextProvider } from '../component/page/veileder/store/VeilederFilterContextProvider'

interface StoreProviderProps {
  children: ReactNode
}

const StoreProvider = (props: StoreProviderProps) => {
  return (
    <ScrollPositionContextProvider>
      <DeltakerSorteringContextProvider>
        <KoordinatorsDeltakerlisterContextProvider>
          <KoordinatorFilterContextProvider>
            <VeilederFilterContextProvider>
              <InnloggetBrukerContextProvider>
                <TilbakelenkeContextProvider>
                  {props.children}
                </TilbakelenkeContextProvider>
              </InnloggetBrukerContextProvider>
            </VeilederFilterContextProvider>
          </KoordinatorFilterContextProvider>
        </KoordinatorsDeltakerlisterContextProvider>
      </DeltakerSorteringContextProvider>
    </ScrollPositionContextProvider>
  )
}

export default StoreProvider
