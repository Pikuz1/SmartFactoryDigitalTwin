import React from 'react';
import FactoryViewer from './components/FactoryViewer';
import { useMachineData } from './hooks/useMachineData';

function App() {
  const { status, temperature, rpm } = useMachineData();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Smart Factory Digital Twin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 3D View */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">3D Factory View</h2>
          <FactoryViewer />
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Control Panel</h2>
          <p><strong>Status:</strong> <span className={status === 'FAULT' ? 'text-red-600' : 'text-green-600'}>{status}</span></p>
          <p><strong>Temperature:</strong> {temperature}°C</p>
          <p><strong>RPM:</strong> {rpm}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
