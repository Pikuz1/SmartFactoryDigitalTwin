import { useEffect, useState } from 'react';

type MachineData = {
  temperature: string;
  rpm: number;
  status: 'OPERATIONAL' | 'FAULT';
};

export const useMachineData = () => {
  const [data, setData] = useState<MachineData>({
    temperature: '0',
    rpm: 0,
    status: 'OPERATIONAL',
  });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
    };

    return () => ws.close();
  }, []);

  return data;
};
