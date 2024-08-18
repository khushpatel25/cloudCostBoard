import { BrowserRouter as Router,Routes,Route } from "react-router-dom";

import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Connect from "./pages/Connect";
import Reports from "./pages/Reports";

function App() {

  return (
    <>
      <Toaster/>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/reports" element={<Reports/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
