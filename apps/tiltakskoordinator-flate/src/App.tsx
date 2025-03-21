import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { BrowserRouter } from 'react-router-dom'
import { useAppContext } from './context-providers/AppContext.tsx'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'
import PrBanner from './components/demo-banner/PrBanner.tsx'
import { AppRoutes } from './Routes.tsx'
import { isPrEnv, useMock } from './utils/environment-utils.ts'
import { HandlingContextProvider } from './context-providers/HandlingContext.tsx'

dayjs.locale(nb)

export const App = () => {
  const { setDeltakerlisteId } = useAppContext()

  return (
    <>
      {isPrEnv && <PrBanner setDeltakerlisteId={setDeltakerlisteId} />}
      {useMock && <DemoBanner />}

      <HandlingContextProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </HandlingContextProvider>
    </>
  )
}
