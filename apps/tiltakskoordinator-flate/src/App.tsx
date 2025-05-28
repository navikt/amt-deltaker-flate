import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { BrowserRouter } from 'react-router-dom'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'
import PrBanner from './components/demo-banner/PrBanner.tsx'
import { useAppContext } from './context-providers/AppContext.tsx'
import { AppRoutes } from './Routes.tsx'
import { isPrEnv, useMock } from './utils/environment-utils.ts'
import { HandlingContextProvider } from './context-providers/HandlingContext.tsx'
import { SorteringContextProvider } from './context-providers/SorteringContext.tsx'

dayjs.locale(nb)

export const App = () => {
  const { setDeltakerlisteId } = useAppContext()

  return (
    <>
      {isPrEnv && <PrBanner setDeltakerlisteId={setDeltakerlisteId} />}
      {useMock && <DemoBanner />}

      <HandlingContextProvider>
        <SorteringContextProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SorteringContextProvider>
      </HandlingContextProvider>
    </>
  )
}
