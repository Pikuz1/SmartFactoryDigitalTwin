import React, { useState } from 'react';
import FactoryViewer from './components/FactoryViewer';
import { useMachineData } from './hooks/useMachineData';
import TemperatureChart from './components/TemperatureChart';

function App() {
  const machines = useMachineData();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedMachine = machines.find((m) => m.id === selected);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Smart Factory Digital Twin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 3D Viewer */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">3D Factory View</h2>
          <FactoryViewer />
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Control Panel</h2>
          <div className="space-y-2">
            {machines.map((m) => (
              <button
                key={m.id}
                className={`block w-full px-4 py-2 border rounded ${
                  m.id === selected ? 'bg-blue-100' : 'bg-gray-50'
                }`}
                onClick={() => setSelected(m.id)}
              >
                {m.id}
              </button>
            ))}
          </div>

          {selectedMachine && (
            <>
              <div className="mt-4">
                <p><strong>Status:</strong> <span className={selectedMachine.status === 'FAULT' ? 'text-red-600' : 'text-green-600'}>
                  {selectedMachine.status}</span></p>
                <p><strong>Temperature:</strong> {selectedMachine.temperature}°C</p>
                <p><strong>RPM:</strong> {selectedMachine.rpm}</p>
              </div>
              <TemperatureChart machineId={selectedMachine.id} temperature={selectedMachine.temperature} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
