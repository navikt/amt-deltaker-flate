import { Navigate, Route, Routes } from 'react-router-dom'
import { App } from './App.tsx'

const APP_ROUTE = `${import.meta.env.BASE_URL}:deltakerlisteId`

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={APP_ROUTE} element={<App />} />
      <Route path="*" element={<Navigate replace to={APP_ROUTE} />} />
    </Routes>
  )
}
