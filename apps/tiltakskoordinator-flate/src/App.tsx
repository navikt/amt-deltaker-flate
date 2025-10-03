import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { BrowserRouter } from 'react-router-dom'
import PrBanner from './components/demo-banner/PrBanner.tsx'
import { useAppContext } from './context-providers/AppContext.tsx'
import { FilterContextProvider } from './context-providers/FilterContext.tsx'
import { HandlingContextProvider } from './context-providers/HandlingContext.tsx'
import { SorteringContextProvider } from './context-providers/SorteringContext.tsx'
import { AppRoutes } from './Routes.tsx'
import { isPrEnv } from './utils/environment-utils.ts'

dayjs.locale(nb)

export const App = () => {
  const { setDeltakerlisteId } = useAppContext()

  return (
    <>
      {isPrEnv && <PrBanner setDeltakerlisteId={setDeltakerlisteId} />}

      <HandlingContextProvider>
        <FilterContextProvider>
          <SorteringContextProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SorteringContextProvider>
        </FilterContextProvider>
      </HandlingContextProvider>
    </>
  )
}
