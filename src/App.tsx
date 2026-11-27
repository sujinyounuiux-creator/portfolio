import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ScreensPage } from './pages/ScreensPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* visual-first page for screen design applications; not in the menu, sent as a link */}
        <Route path="screens" element={<ScreensPage />} />
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          {/* the Case Study page is gone: its projects are Featured Works on Home */}
          <Route path="work" element={<Navigate to="/#work" replace />} />
          {/* ASCLO now lives as a gallery on Home; keep old links working */}
          <Route path="work/asclo" element={<Navigate to="/#asclo" replace />} />
          {/* Cookpad was removed from the portfolio (it is in the 27 Nov 2026 snapshot) */}
          <Route path="work/cookpad" element={<Navigate to="/#work" replace />} />
          <Route path="work/:slug" element={<CaseStudyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
