import { useEffect, useState } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="text-4xl font-mono text-center mb-8">
      {time.toLocaleTimeString()}
    </div>
  );
}

export default Clock;