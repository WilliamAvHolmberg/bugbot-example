import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './app/layout/AppLayout'
import { AppSelector } from './app/navigation/AppSelector'
import { buildRoutes, getAllRoutes } from './app/routing/routeBuilder'
import { applications } from './applications'

function App() {
  const allRoutes = getAllRoutes(applications)

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<AppSelector />} />
          {buildRoutes(allRoutes)}
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
