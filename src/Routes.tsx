import {Navigate, Route, Routes} from 'react-router-dom'
import {Page1} from './pages/Page1.tsx'
import {Page2} from './pages/Page2.tsx'
import App from './App.tsx'

const base = 'arbeidsmarkedstiltak/tiltak/:id/deltaker'
export const APP = ''
export const PAGE_1 = 'page1'
export const PAGE_2 = 'page2'

export const AppRoutes = () => {

  return (
    <Routes>
      <Route path={`${base}`} element={<App/>}/>
      <Route path={APP} element={<App/>}/>
      <Route path={PAGE_1} element={<Page1/>}/>
      <Route path={PAGE_2} element={<Page2/>}/>
      <Route path={`${base}/*`} element={<Navigate replace to={`${base}`}/>}/>
    </Routes>
  )
}
