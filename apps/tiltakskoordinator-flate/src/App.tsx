import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { BrowserRouter } from 'react-router-dom'
import { useAppContext } from './context-providers/AppContext.tsx'
import DemoBanner from './components/demo-banner/DemoBanner.tsx'
import PrBanner from './components/demo-banner/PrBanner.tsx'
import { AppRoutes } from './Routes.tsx'
import { isPrEnv, useMock } from './utils/environment-utils.ts'

dayjs.locale(nb)

export const App = () => {
  const { setDeltakerlisteId } = useAppContext()

  // eslint-disable-next-line no-console
  console.log('App, isPrEnv', isPrEnv)
  return (
    <>
      {isPrEnv && <PrBanner setDeltakerlisteId={setDeltakerlisteId} />}
      {useMock && <DemoBanner />}

      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  )
}
