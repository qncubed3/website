import { HashRouter, Routes, Route, Link } from "react-router-dom"

import Home from "./pages/Home"
import About from "./pages/About"
import Projects from "./pages/Projects"

export default function App() {
  return (
    <HashRouter>
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <nav
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </HashRouter>
  )
}