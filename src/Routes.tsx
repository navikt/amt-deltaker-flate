import {Navigate, Route, Routes} from 'react-router-dom'
import {Page1} from './pages/Page1.tsx'
import {Page2} from './pages/Page2.tsx'
import App from './App.tsx'

export const AppRoutes = () => {
  const base = 'arbeidsmarkedstiltak/tiltak/:id/deltaker'

  return (
    <Routes>
      <Route path={`${base}`} element={<App/>}/>
      <Route path={`${base}/page1`} element={<Page1/>}/>
      <Route path={`${base}/page2`} element={<Page2/>}/>
      <Route path={`${base}/*`} element={<Navigate replace to={`${base}`}/>}/>
    </Routes>
  )
}
