import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ScrollManager } from './components/ScrollManager'
import { ClickSpark } from './components/ClickSpark'
import { HomePage } from './pages/HomePage'
import { GamePage } from './pages/GamePage'
import { ToastProvider } from './lib/useToast'
import { useReveal } from './lib/useReveal'
import { SCP_SL, SCP_CBM } from './data/servers'

function RootLayout() {
  const { pathname } = useLocation()
  useReveal(pathname)
  return (
    <>
      <ScrollManager />
      <ClickSpark />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/sl" element={<GamePage block={SCP_SL} />} />
          <Route path="/cbm" element={<GamePage block={SCP_CBM} />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}
