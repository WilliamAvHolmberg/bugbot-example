import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './app/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { UsersPage } from './features/users/routes/UsersPage'

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
