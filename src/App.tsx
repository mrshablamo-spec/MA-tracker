import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { DashboardPage } from '@/pages/DashboardPage'
import { SynergyCalculatorPage } from '@/pages/SynergyCalculatorPage'
import { DealDetailPage } from '@/pages/DealDetailPage'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/calculator" element={<SynergyCalculatorPage />} />
        <Route path="/deal/:id" element={<DealDetailPage />} />
      </Routes>
    </div>
  )
}
