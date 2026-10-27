import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Toaster } from 'sonner';
import { Header, MobileNav } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { Home } from './pages/Home';
import { Metric } from './pages/Metric';
import { Framework } from './pages/Framework';
import { Customise } from './pages/Customise';
import { useMode } from './lib/mode';

function Pages() {
  const loc = useLocation();
  // Switching a metric's sheet tab stays on the same page; anything else is a new page.
  const key = loc.pathname.startsWith('/a4/') ? loc.pathname.split('/').slice(0, 3).join('/') : loc.pathname;
  return (
    // Scroll to the top once the old page has faded out, not while it is still showing.
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0 })}>
      <motion.main key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
        transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-[1240px] px-4 pb-24 sm:px-6">
        <Routes location={loc}>
          <Route path="/" element={<Home />} />
          <Route path="/naac" element={<Framework />} />
          <Route path="/brand" element={<Customise />} />
          <Route path="/a4/:id/:tab?" element={<Metric />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export function App() {
  const mode = useMode();
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Header />
        <Pages />
        <MobileNav />
        <CommandPalette />
        <Toaster theme={mode} position="bottom-right" mobileOffset={{ bottom: 84 }}toastOptions={{ style: { fontFamily: 'var(--font-sans)' } }} />
      </BrowserRouter>
    </MotionConfig>
  );
}
