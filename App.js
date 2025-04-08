import './App.css';
import React, { useRef, useEffect, useState } from 'react';

function App() {
  const initialSchedules = [
    { start: "0", end: "7", label: "😴" },
    { start: "7", end: "7.5", label: "🧘‍♀️" },
    { start: "7.5", end: "8", label: "📰" },
    { start: "8", end: "11.5", label: "🔥💻" },
    { start: "11.5", end: "13", label: "🥗" },
    { start: "13", end: "15", label: "💻" },
    { start: "15", end: "17", label: "✍🏻" },
    { start: "17", end: "19", label: "🏃🏻‍♀️" },
    { start: "19", end: "19.5", label: "🍽️" },
    { start: "19.5", end: "20.5", label: "😌" },
    { start: "20.5", end: "22.5", label: "✍🏻" },
    { start: "22.5", end: "23", label: "📚" },
    { start: "23", end: "24", label: "📝" },
  ];
  
  const canvasRef = useRef(null);
  const [time, setTime] = useState(new Date());

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem("schedules");
    return saved ? JSON.parse(saved) : initialSchedules;
  });
  
  useEffect(() => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  }, [schedules]);
  const [newSchedule, setNewSchedule] = useState({ start: '', end: '', label: '', color: '#fcd34d' });
  const [title, setTitle] = useState(() => {
    return localStorage.getItem("timetableTitle") || "My Timetable";
  });
  const [showScheduleList, setShowScheduleList] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("timetableTitle", title);
  }, [title]);
  const [colorMap] = useState(() => {
    const saved = localStorage.getItem("colorMap");
    return saved ? JSON.parse(saved) : {};
  });
  
  useEffect(() => {
    localStorage.setItem("colorMap", JSON.stringify(colorMap));
  }, [colorMap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    schedules.forEach(({ start, end, label, color }) => {
      const startAngle = (parseFloat(start) / 24) * 2 * Math.PI - Math.PI / 2;
      const endAngle = (parseFloat(end) / 24) * 2 * Math.PI - Math.PI / 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius - 10, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color || "rgba(240, 212, 121, 0.13)";
      ctx.fill();
      ctx.strokeStyle = "rgba(186, 186, 186, 0.36)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const midAngle = (startAngle + endAngle) / 2;
      const textX = centerX + (radius - 40) * Math.cos(midAngle);
      const textY = centerY + (radius - 40) * Math.sin(midAngle);

      ctx.fillStyle = '#111';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, textX, textY);
    });

    for (let i = 0; i < 24; i++) {
      const angle = ((i / 24) * 2 * Math.PI) - Math.PI / 2;
      const textRadius = radius + 10;
      const textX = centerX + textRadius * Math.cos(angle);
      const textY = centerY + textRadius * Math.sin(angle);

      ctx.fillStyle = '#000';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString(), textX, textY);
    }

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const angle = ((totalSeconds / 86400) * 2 * Math.PI) - Math.PI / 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.9 * Math.cos(angle),
      centerY + radius * 0.9 * Math.sin(angle)
    );
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.stroke();
  }, [time, schedules]);

  const handleInputChange = (e) => {
    setNewSchedule({
      ...newSchedule,
      [e.target.name]: e.target.value,
    });
  };

  const addSchedule = (e) => {
    e.preventDefault();
    if (!newSchedule.start || !newSchedule.end || !newSchedule.label) return;
    setSchedules([...schedules, newSchedule]);
    setNewSchedule({ start: '', end: '', label: '', color: '#fcd34d' });
  };

  const deleteSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold text-center border-b p-2"
        />
      </h1>

      <canvas ref={canvasRef} width={450} height={450} />

      <form onSubmit={addSchedule} className="space-x-2">
        <input
          type="text"
          name="start"
          placeholder="시작 (예: 8)"
          value={newSchedule.start}
          onChange={handleInputChange}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="end"
          placeholder="끝 (예: 9.5)"
          value={newSchedule.end}
          onChange={handleInputChange}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="label"
          placeholder="라벨 (예: 간식)"
          value={newSchedule.label}
          onChange={handleInputChange}
          className="border px-2 py-1 rounded"
        />
        <input
          type="color"
          name="color"
          value={newSchedule.color}
          onChange={handleInputChange}
          className="w-10 h-10 p-1 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          추가
        </button>
      </form>

      <button
        onClick={() => setShowScheduleList(!showScheduleList)}
        className="text-sm text-blue-700 underline"
      >
        {showScheduleList ? '스케줄 목록 숨기기' : '스케줄 목록 보기'}
      </button>

      {showScheduleList && (
        <ul className="bg-white shadow-md p-4 rounded w-80">
          {schedules.map((s, i) => (
            <li key={i} className="flex justify-between items-center border-b py-1">
              <span className="text-sm">{s.start} - {s.end} : {s.label}</span>
              <button
                onClick={() => deleteSchedule(i)}
                className="text-red-500 text-xs hover:underline"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
