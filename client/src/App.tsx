import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const BuildEstimate = lazy(() => import("./pages/BuildEstimate"));
const Estimate = lazy(() => import("./pages/Estimate"));
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Suspense fallback={<div></div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/estimate/:id" element={<Estimate />} />
          <Route path="/estimates/build" element={<BuildEstimate />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
