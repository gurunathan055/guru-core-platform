import { NextResponse } from 'next/server';

export async function GET() {
  const mockData = {
    callVolume: [
      { date: '2024-01-01', calls: 234 },
      { date: '2024-01-02', calls: 289 },
      { date: '2024-01-03', calls: 312 },
      { date: '2024-01-04', calls: 276 },
      { date: '2024-01-05', calls: 298 },
      { date: '2024-01-06', calls: 325 },
      { date: '2024-01-07', calls: 341 },
    ],
    resolution: [
      { hour: '00:00', ai: 45, human: 5 },
      { hour: '04:00', ai: 32, human: 3 },
      { hour: '08:00', ai: 78, human: 12 },
      { hour: '12:00', ai: 95, human: 15 },
      { hour: '16:00', ai: 88, human: 10 },
      { hour: '20:00', ai: 62, human: 8 },
    ],
    sentiment: [
      { name: 'Positive', value: 68 },
      { name: 'Neutral', value: 24 },
      { name: 'Negative', value: 8 },
    ],
    peakHours: [
      { hour: '09:00', calls: 124 },
      { hour: '10:00', calls: 156 },
      { hour: '11:00', calls: 189 },
      { hour: '12:00', calls: 167 },
      { hour: '13:00', calls: 143 },
      { hour: '14:00', calls: 178 },
      { hour: '15:00', calls: 198 },
      { hour: '16:00', calls: 134 },
    ],
  };

  return NextResponse.json(mockData);
}
