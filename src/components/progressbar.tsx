import React, { useState, useEffect } from 'react';
import { Progress } from "@/src/components/ui/progress"

const ProgressBar = ({ targetValue = 100 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < targetValue) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 50); 

    return () => clearInterval(interval);
  }, [targetValue]);

  return (
      <Progress value={progress} className="w-64 h-4" />
  );
};

export default ProgressBar;
