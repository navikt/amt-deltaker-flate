import {Navigate, Route, Routes} from 'react-router-dom'
import {Pamelding} from './pages/Pamelding.tsx'
import {Delakelse} from './pages/Delakelse.tsx'
import App from './App.tsx'

const base = 'arbeidsmarkedstiltak/tiltak/:id/deltaker'

export const PAMELDING_PAGE = 'pamelding'
export const DELTAKELSE_PAGE = 'deltaker'

export const AppRoutes = () => {

  return (
    <Routes>
      <Route path={`${base}`} element={<App/>}/>
      <Route path={`${base}/${PAMELDING_PAGE}`} element={<Pamelding/>}/>
      <Route path={`${base}/${DELTAKELSE_PAGE}`} element={<Delakelse/>}/>
      <Route path={`${base}/*`} element={<Navigate replace to={`${base}`}/>}/>
    </Routes>
  )
}
