import { useEffect, useState } from 'react';

type Machine = {
  id: string;
  temperature: string;
  rpm: number;
  status: 'OPERATIONAL' | 'FAULT';
};

export const useMachineData = () => {
  const [data, setData] = useState<Machine[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const machines = JSON.parse(event.data);
      setData(machines);
    };

    return () => ws.close();
  }, []);

  return data;
};
