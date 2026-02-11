import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/Auth/Auth'
import PTOPlansPage from './pages/PTOPlans/PtoPlans'
import TripsPage from './pages/Trips/Trips'
import NewPTOPlanPage from './pages/PTOPlans/NewPTOPlan'

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path='/auth' element={<AuthPage />} />

                {/* Protected Routes */}
                <Route path='/ptoplans' element={<ProtectedRoute><PTOPlansPage /></ProtectedRoute>} />
                
                <Route path='/ptoplans/new' element={<ProtectedRoute><NewPTOPlanPage /></ProtectedRoute>} />

                <Route path='/trips' element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />

                {/* Default Route */}
                <Route path='*' element={<AuthPage />} />
            </Routes>
        </Router>
    )
}