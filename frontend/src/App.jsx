import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notes from "./pages/Notes";
import Auth from "./pages/Auth";
import Install from "./pages/Install";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Notes />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/notes/install" element={<Install />} />
        <Route path="/notes/:type" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;