import { Line } from 'react-chartjs-2';
import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

type Props = {
  machineId: string;
  temperature: string;
};

const TemperatureChart = ({ machineId, temperature }: Props) => {
  const [dataPoints, setDataPoints] = useState<{ x: number; y: number }[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const point = { x: Date.now(), y: parseFloat(temperature) };
    setDataPoints((prev) => [...prev.slice(-20), point]); // Keep last 20 points
  }, [temperature]);

  return (
    <div className="mt-4">
      <Line
        data={{
          datasets: [
            {
              label: `${machineId} Temperature`,
              data: dataPoints,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.4,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              type: 'linear',
              title: { display: true, text: 'Time' },
              ticks: { display: false },
            },
            y: {
              title: { display: true, text: '°C' },
            },
          },
        }}
      />
    </div>
  );
};

export default TemperatureChart;
