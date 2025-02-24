import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './pages/common_pages/HomePage'
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Pagenotfound from './pages/common_pages/pagenotfound'
import Header from './components/common_components/Header'
import Footer from './components/common_components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/homepage" element={<HomePage />}></Route>
        <Route path="/pagenotfound" element={<Pagenotfound />}></Route>
        <Route path="/*" element={<Pagenotfound />}></Route>
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
