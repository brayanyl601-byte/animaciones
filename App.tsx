import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Overlay } from './components/Overlay';
import { INITIAL_ASSETS } from './constants';
import { AnimationAsset } from './types';

function App() {
  // Estado para las animaciones (persiste mientras no se recargue la página)
  const [assets, setAssets] = useState<AnimationAsset[]>(INITIAL_ASSETS);

  return (
    <HashRouter>
      <Routes>
        {/* Ruta Principal: Dashboard (Público, con opción de Admin interna) */}
        <Route path="/" element={
          <Dashboard 
            assets={assets} 
            setAssets={setAssets} 
          />
        } />
        
        {/* Ruta Overlay OBS (Pública) */}
        <Route path="/overlay/:id" element={<Overlay assets={assets} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;