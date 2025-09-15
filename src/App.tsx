import { Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { Schedule } from './pages/Schedule'
import { Scheduling } from './pages/Scheduling'
import { Admin } from './pages/Admin'
import { AdminSchedules } from './pages/AdminSchedules'

export function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/singup' element={<SignUp />} />
      <Route path='/schedule' element={<Schedule />} />
      <Route path='/scheduling' element={<Scheduling />} />
      <Route path='/admin' element={<Admin />} />
      <Route path='/admin/schedules' element={<AdminSchedules />} />
    </Routes>
  )
}