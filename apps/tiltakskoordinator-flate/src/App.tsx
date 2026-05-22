import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import PrBanner from './components/demo-banner/PrBanner.tsx'
import { useAppContext } from './context-providers/AppContext.tsx'
import { FilterContextProvider } from './context-providers/FilterContext.tsx'
import { HandlingContextProvider } from './context-providers/HandlingContext.tsx'
import { SorteringContextProvider } from './context-providers/SorteringContext.tsx'
import { AppRoutes } from './Routes.tsx'
import { isPrEnv, useMock } from './utils/environment-utils.ts'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'
import { queryClient } from './queryClient.ts'

dayjs.locale(nb)

export const App = () => {
  const { setDeltakerlisteId } = useAppContext()

  return (
    <QueryClientProvider client={queryClient}>
      {isPrEnv && <PrBanner setDeltakerlisteId={setDeltakerlisteId} />}
      {useMock && <DemoBanner />}

      <HandlingContextProvider>
        <FilterContextProvider>
          <SorteringContextProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SorteringContextProvider>
        </FilterContextProvider>
      </HandlingContextProvider>
    </QueryClientProvider>
  )
}
