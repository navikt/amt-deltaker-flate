import { Navigate, Route, Routes } from 'react-router-dom'
import App from './App.tsx'

export const appUrl = (path: string): string => {
  const strippedPath = path.startsWith('/') ? path.substring(1) : path
  return `${import.meta.env.BASE_URL}${strippedPath}`
}

export const APP_ROUTE = appUrl('/:deltakerId')

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={APP_ROUTE} element={<App />} />
      <Route path="*" element={<Navigate replace to={APP_ROUTE} />} />
    </Routes>
  )
}
