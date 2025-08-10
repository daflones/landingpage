import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Capture from './pages/Capture'
import Reveal from './pages/Reveal'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-dark-purple via-dark-blue to-primary-purple">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Routes>
            <Route path="/" element={<Capture />} />
            <Route path="/reveal" element={<Reveal />} />
          </Routes>
        </motion.div>
      </div>
    </Router>
  )
}

export default App
