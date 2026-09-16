import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notes from "./pages/Notes";
import Auth from "./pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Notes />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/notes/:type" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;